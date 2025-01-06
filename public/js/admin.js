import req from "express/lib/request";

const deleteProduct = (btn) => {
    const id = btn.parentNode.querySelector('[name=id]').value;
    const imageUrl = btn.parentNode.querySelector('[name=imageUrl]').value;
    const csrfToken = btn.parentNode.querySelector('[name=CSRFToken]').value;
    const productElement = btn.closest('article');

    fetch(`/admin/product/${id}`, {
        method: 'DELETE',
        headers: {
            "x-csrf-token": csrfToken,
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => console.log(err));
};
