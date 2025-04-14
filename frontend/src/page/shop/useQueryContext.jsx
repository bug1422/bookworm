import { createContext, useState, useEffect, useContext } from "react";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState("");
  const [shows, setShows] = useState(20);
  const [currentPage, setCurrentPage] = useState();
  const [bookList, setBookList] = useState({});
  useEffect(() => {
    console.log(`${filters} ${sorts} ${shows}`)
    //Call api
  }, [filters, sorts, shows]);
  return (
    <QueryContext.Provider
      value={{
        filters: filters,
        setFilters: setFilters,
        sorts: sorts,
        setSorts: setSorts,
        shows: shows,
        setShows: setShows,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        list: bookList.data,
        maxPage: 5
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export const useQuery = () => {
    return useContext(QueryContext)
}