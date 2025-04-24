import { useParams } from "react-router-dom";
import BookDetailSection from "./bookDetailSection";
import ReviewSection from "./reviewSection";

const ProductPage = () => {
  const { id } = useParams();

  return (
    <div className="">
      <BookDetailSection id={id}/>
      <ReviewSection />
    </div>
  );
};

export default ProductPage;
