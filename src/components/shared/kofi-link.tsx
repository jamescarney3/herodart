interface KofiLinkProps {
  className?: string;
}

const KofiLink = ({ className }: KofiLinkProps) => {
  return (
    <a href="https://ko-fi.com/K3K71RXRSO" target="_blank">
      <img className={className} src="https://storage.ko-fi.com/cdn/kofi6.png?v=6" alt="Buy Me a Coffee at ko-fi.com" />
    </a>
  );
};

export default KofiLink;
