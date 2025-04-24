import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const ReviewSection = ({id = undefined}) => {
    const { data: book, isLoading } = useQuery({
        queryKey: [`product-${id}`],
        queryFn: () => fetchReviews()
      })
      const fetchReviews = () => {
    
      }
    return (
        <div className="grid grid-cols-5">

        </div>
    )
}

export default ReviewSection