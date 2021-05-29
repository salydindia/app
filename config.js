const apiUrl = {
  devUrl: '',
  prodUrl: 'https://salyd-server.herokuapp.com/',
};

export const url = apiUrl.devUrl ? apiUrl.devUrl : apiUrl.prodUrl;
