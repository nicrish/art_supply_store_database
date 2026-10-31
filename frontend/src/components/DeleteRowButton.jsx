const DeleteRowButton = ({
    rowObject,
    backendURL,
    refreshData,
    idKey,
    endpoint,
    bodyKey,
    confirmMessage
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!window.confirm(confirmMessage || 'Are you sure you want to delete this row?')) {
            return;
        }

        try {
            const response = await fetch(backendURL + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [bodyKey]: rowObject[idKey] })
            });
            if (response.ok) {
                console.log("Row deleted");
                refreshData();
            } else {
                console.error("Error during deletion");
                alert("Could not delete this row. Please try again.");
            }
        } catch (error) {
            console.error('Error during deletion:', error);
            alert("Error connecting to the server. Please try again.");
        }
    };

    return (
        <td>
            <form onSubmit={handleSubmit}>
                <button type="submit">Delete</button>
            </form>
        </td>
    )
};

export default DeleteRowButton;
