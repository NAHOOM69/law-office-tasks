const ErrorPage = ({ statusCode }) => {
    return <p>שגיאה {statusCode || 500} אירעה באפליקציה.</p>;
};

export default ErrorPage;
