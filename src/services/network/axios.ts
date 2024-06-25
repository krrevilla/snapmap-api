import axios from 'axios';
import { Config } from '../../config';

export const auth0Axios = axios.create({
  baseURL: Config.AUTH0_ISSUER_URL,
});

export const auth0Endpoints = {
  userinfo: 'userinfo',
};
