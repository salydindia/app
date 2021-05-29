import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Alert,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {LEAVE_ORDER} from '../../constants/strings';
import OutletHero from '../../components/Order/OutletHero';
import {SceneBuilder, Header, Heading} from '../../components/Shared';
import {GRAY} from '../../constants/colors';
import MenuList from '../../components/Order/MenuList';
import OutletHeader from '../../components/Order/OutletHeader';
import {useContext} from 'react';
import {GlobalContext} from '../../context/GlobalState';
import {gql, useQuery} from '@apollo/client';

const {width, height} = Dimensions.get('screen');

const OrderScene = ({navigation, route}) => {
  const {globalRoomId} = useContext(GlobalContext);

  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [headerColor, setHeaderColor] = useState('transparent');
  const [headingTint, setHeadingTint] = useState(255);
  const [restro, setRestro] = useState({});

  const handleOnScroll = (event) => {
    if (event.nativeEvent.contentOffset.y < height / 2) {
      setScrollYPosition(event.nativeEvent.contentOffset.y);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleParallaxImageScrolled = (scrolled) => {
    if (scrolled) {
      setHasScrolled(true);
      setHeaderColor(GRAY.T2);
      setHeadingTint(0);
    } else {
      setHasScrolled(false);
      setHeaderColor('transparent');
    }
  };

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // if (hasItemsInCart) {
        //   return;
        // }

        e.preventDefault();

        Alert.alert(LEAVE_ORDER.HEADING, LEAVE_ORDER.BODY, [
          {text: LEAVE_ORDER.CANCEL, onPress: () => {}},
          {
            text: LEAVE_ORDER.OK,
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation],
  );

  const GET_RESTRODETAILS = gql`
    query GETRESTRO($roomId: Int!) {
      getRestroDetails(roomId: $roomId) {
        _id
        users {
          _id
          name
        }
        table {
          _id
        }
        tableOf {
          _id
          name
          menu {
            _id
            name
            price
            maxQuantity
            description
            category
          }
        }
      }
    }
  `;

  const {loading, error, data} = useQuery(GET_RESTRODETAILS, {
    variables: {roomId: parseInt(globalRoomId)},
    onCompleted: (mydata) => setRestro(mydata.getRestroDetails.tableOf),
  });

  return (
    <ScrollView onScroll={handleOnScroll} stickyHeaderIndices={[1]}>
      <OutletHero
        details={restro}
        yOffset={scrollYPosition}
        onParallaxImageScrolled={handleParallaxImageScrolled}
        headingTint={headingTint}
        setHeadingTint={setHeadingTint}
      />

      <View
        style={{
          position: 'absolute',
          width,
          backgroundColor: headerColor,
        }}>
        <OutletHeader
          name={restro.name}
          headerColor={headerColor}
          handleBack={handleBack}
          headingTint={headingTint}
          hasScrolled={hasScrolled}
        />
      </View>

      <SceneBuilder>
        <MenuList data={restro.menu} />

        <View style={{height: height / 5}} />
      </SceneBuilder>
    </ScrollView>
  );
};

export default OrderScene;
