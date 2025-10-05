const NotFound: React.FC = () => {
  return (
    <div className="main-content">
      <div className="page-header">
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔍</div>
        <h1 className="page-title">404 - Page Not Found</h1>
        <p className="page-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  )
}
export default NotFound
