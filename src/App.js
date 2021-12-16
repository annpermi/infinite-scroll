import { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import ReactLoading from "react-loading";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  //ref it's a value witch keeps after each render. If we wanna store something between state, which is not a part of our state, we should use Ref
  //save reference of part of Api
  //but it's not update every single time when it's changes
  const observer = useRef();

  //useCallback = because useRef is not update every single time when reference change
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return; //don't trigger the infinite scrolling while loading
      if (observer.current) observer.current.disconnect(); // disconnect our observer from the prev element
      observer.current = new IntersectionObserver((entries) => {
        //isIntersecting - on the page somewhere
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className="App">
      <h1>Search Book Title</h1>
      <input type="text" onChange={handleSearch} value={query} />
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {loading && (
          <ReactLoading
            type={"bubbles"}
            color={"red"}
            height={200}
            width={200}
          />
        )}
      </div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default App;
