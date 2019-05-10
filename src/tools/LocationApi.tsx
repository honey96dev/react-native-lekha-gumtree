import Fuse from "fuse.js";
import Cities from "../fixtures/Locations";
const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.2,
    location: 0,
    distance: 0,
    maxPatternLength: 10,
    minMatchCharLength: 2,
    keys: ["suburb", "postCode"]
};

const fuse = new Fuse(Cities, options);
//Create a public facing search method
//So we can replace it with api call later
// console.log('fuse', fuse);
const search = (term: string) => fuse.search(term);

export default search;
