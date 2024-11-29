function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary"></div>
      <span className="ml-2 text-primary">Loading...</span>
    </div>
  );
}

export default Loading;