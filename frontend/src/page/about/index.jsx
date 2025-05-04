const WelcomeSection = () => {
  return (
    <div>
      <div className="font-bold text-3xl text-center mb-1">
        Welcome to Bookworm
      </div>
      <p>
        "Bookworm is an independent New York bookstore and language school with
        locations in Manhattan and Brooklyn. We specialize in travel books and
        language classes."
      </p>
    </div>
  );
};

const StorySection = () => {
  return (
    <div>
      <div className="font-bold text-3xl">Our Story</div>
      <p className="my-6">
        The name Bookworm was taken from the original name for New York
        International Airport, which was renamed JFK in December 1963.
      </p>
      <p className="my-6">
        Our Manhattan store has just moved to the West Village. Our new location
        is 170 7th Avenue South, at the corner of Perry Street.
      </p>
      <p className="my-6">
        From March 2008 through May 2016, the store was located in the Flatiron
        District.
      </p>
    </div>
  );
};

const VisionSection = () => {
  return (
    <div>
      <div className="font-bold text-3xl">Our Vision</div>
      <p className="my-6">
        One of the last travel bookstores in the country, our Manhattan store
        carries a range of guidebooks (all 10% off) to suit the needs and tastes
        of every traveller and budget.
      </p>
      <p className="my-6">
        We believe that a novel or travelogue can be just as valuable a key to a
        place as any guidebook, and our well-read, well-travelled staff is happy
        to make reading recommendations for any traveller, book lover, or gift
        giver.
      </p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <>
      <div className="py-8 mb-12 border-b-2 border-gray-200 xl:text-2xl font-bold text-center">
        About Us
      </div>
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 max-w-screen-lg mx-auto text-2xl">
        <WelcomeSection />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <StorySection />
          <VisionSection />
        </div>
      </div>
    </>
  );
};

export default AboutPage;
