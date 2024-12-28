document.getElementById('filterButton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action of the button

    const budget = document.getElementById('budget').value;
    const imageContainer = document.getElementById('imageContainer');

    // Clear previous images
    imageContainer.innerHTML = '';

    if (budget > 0) {
        const imagesToShow = Math.min(Math.floor(budget / 100), 5); // 1 image per $100, max 5 images
        const imgList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

        for (let i = 0; i < imagesToShow; i++) {
            const imgElement = document.createElement('img');
            imgElement.src = `img/Livingroom/${imgList[i]}.jpg`;
            imgElement.alt = imgList[i];

            // Log the image path to verify it
            console.log(`Loading image: img/Livingroom/${imgList[i]}.jpg`);

            imageContainer.appendChild(imgElement);
        }
    } else {
        alert('Please enter a valid budget!');
    }
});
