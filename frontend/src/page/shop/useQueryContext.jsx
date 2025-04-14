import { createContext, useState, useEffect, useContext } from "react";

const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState({});
  const [shows, setShows] = useState(20);
  const [bookList, setBookList] = useState({});
  useEffect(() => {
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
        list: bookList,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export const useQuery = () => {
    return useContext(QueryContext)
}