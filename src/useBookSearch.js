import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false); //prevent of making request which we don't want (numFound = 0)

  //Every time when we query something, clear prev state book
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((book) => book.title),
            ]),
          ]; //return only one title uniq
        });
        setHasMore(res.data.docs.length > 0); // if false prevent making another api call
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
      });

    return () => cancel(); // it will cancel our request every single time wil call our useEffect
  }, [query, pageNumber]);

  return { loading, error, books, hasMore };
}
