const Loader = ({ fullScreen = true }) => {
  const containerClass = fullScreen
    ? 'flex justify-center items-center min-h-screen'
    : 'flex justify-center items-center p-8';

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
};

export default Loader;
