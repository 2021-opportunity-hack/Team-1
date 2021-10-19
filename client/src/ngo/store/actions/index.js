import axios from 'axios';
import moment from 'moment-timezone'


/**
 * Axios Intercepter
 * To Avoid Dublicates Service call 
 * @param {*} state 
 * @returns 
 */
let pending = [];
let cancelToken = axios.CancelToken;
let removePending = ever => {
  for (let p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      pending[p].f();
      pending.splice(p, 1);
    }
  }
};
axios.interceptors.request.use(
  config => {
    config.cancelToken = new cancelToken(c => {
      if (pending.findIndex(val => val.u == config.url + '&' + config.method) != -1) {
        c();
      } else {
        pending.push({ u: config.url + '&' + config.method, f: c });
      }
    });
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  res => {
    removePending(res.config);
    return res;
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('Canceled repeated request');
    } else {
      console.error(error.response);
    }
    return Promise.reject(error);
  }
);




/**
 * Update User Infomation
 */
export const updateUser = async () => {

  let response = await axios.get('/user/getUser')
  if (response.data.result.redirect) {
    if (response.data.result.environment == 'production') {
      window.location.href = 'https://ssoqa.paypalcorp.com/idp/startSSO.ping?PartnerSpId=socailappsqa&TargetResource=https://socialapps.qa.paypal.com/twitter/';
    }
    else {
      window.location.href = 'https://ssodev.paypalcorp.com/idp/startSSO.ping?PartnerSpId=socailappsdev&TargetResource=https://proactive-apps.pp-devcos-smarttools.us-central1.gcp.dev.paypalinc.com/saml/acs';
    }   
  }
  return {
    type: 'UPDATE_USER',
    payload: response.data.result
  };
}

/**
 * Update Events
 */
export const updateEvent = async (event) => {
  let response = await axios.post(`/twitter/api/updateEvent`, { data: event })
  return {
    type: 'UPDATE_EVENT',
    payload: null,
  };
}

/**
 * Get DashboardData
 */
export const getDashboardData = async (date, country) => {
  let response = await axios.get(`/twitter/api/getDashboardData?date=${date}&country=${country}`)
  return {
    type: 'UPDATE_DASHBOARD',
    payload: response.data.result,
    date,
    country
  };
}