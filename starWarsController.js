const axios = require('axios');

module.exports = {
  async getPeople(req, res) {
    let { sortBy } = req.query;
    // let more = true;
    // let pageNumber = 1;
    let fullList = await getFullList('https://swapi.co/api/people');
    // while (more) {
    //   let { data } = await axios.get(
    //     `https://swapi.co/api/people?page=${pageNumber}`
    //   );
    //   fullList = fullList.concat(data.results);
    //   if (!data.next) more = false;
    //   else pageNumber++;
    // }
    if (sortBy) {
      fullList = fullList.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        if (sortBy === 'mass' || sortBy === 'height') {
          aVal = isNaN(Number(aVal)) ? aVal : Number(aVal);
          bVal = isNaN(Number(bVal)) ? bVal : Number(bVal);
        }
        if (aVal < bVal) return -1;
        if (aVal > bVal || aVal === 'unknown' || bVal === 'unknown') return 1;
        return 0;
      });
    }
    res.send(fullList);
  },
  async getPlanets(req, res) {
    let reqPlanets = {};
    let fullList = [];
    let more = true;
    let pageNumber = 1;
    while (more) {
      let { data } = await axios.get(
        `https://swapi.co/api/planets?page=${pageNumber}`
      );
      fullList = fullList.concat(data.results);
      if (!data.next) more = false;
      else pageNumber++;
    }
    let promiseArr = [];
    fullList.forEach((p, fullListIndex) => {
      if (p.residents.length) {
        p.residents.forEach((url, i) => {
          if (!reqPlanets[url]) reqPlanets[url] = [fullListIndex];
          else reqPlanets[url].push(fullListIndex);
        });
        p.residents = [];
      }
    });
    Object.keys(reqPlanets).forEach((k, i) => {
      promiseArr.push(axios.get(k));
    });

    Promise.all(promiseArr).then(values => {
      values.forEach(res => {
        reqPlanets[res.data.url].forEach(fullListIndex =>
          fullList[fullListIndex].residents.push(res.data.name)
        );
      });
      res.send(fullList);
    });
  }
};

async function getFullList(url, pageNumber = 1, fullList = []) {
  console.log('pageNumber ', pageNumber, 'fullList lenght ', fullList.length);
  let { data } = await axios.get(`${url}?page=${pageNumber}`);
  fullList = fullList.concat(data.results);
  if (!data.next) return fullList;
  else return getFullList(url, pageNumber + 1, fullList);
}
