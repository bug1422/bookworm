const Footer = () => {
  return (
    <footer className="h-[10vh] flex py-5 items-center gap-2 bg-indigo-300">
      <img
        className="ms-6"
        src="/assets/book-placeholder.png"
        alt="bookworm-footer"
      />
      <div>
        <div className="font-bold text-xl">BOOKWORM</div>
        <div>Adress</div>
        <div>Phone</div>
      </div>
    </footer>
  );
};

export default Footer;
