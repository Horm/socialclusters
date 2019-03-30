import * as axios from "axios";
import {API_URL} from "./Constants";

export function getCountsByDay(from, to) {
  return axios.get(`${API_URL}/stats/day/topic`, {
    params: {
      from,
      to
    }
  })
}

export function getWithoutTopicCount() {
  return axios.get(`${API_URL}/stats/withoutTopic`)
}

export function getWithSuggestedTopicCount() {
  return axios.get(`${API_URL}/stats/withSuggestedTopic`)
}
