document.getElementById('filterButton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action of the button
  
    const budget = document.getElementById('budget').value;
    const imageContainer = document.querySelector('.image-container');

    // Clear previous images
    imageContainer.innerHTML = '';
    
    if (budget > 0) {
        const imagesToShow = Math.min(Math.floor(budget / 100000), 24); // 1 image per $100, max 5 images
        
        // List of images from a.png to k.png
        const imgList = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10","b11", "b12","b13","b14","b15","b16","b17","b18","b19","b20","b21","b22","b23","b24"];
        
        // Loop through the images and display the appropriate number
        for (let i = 0; i < imagesToShow; i++) {
            const imgElement = document.createElement('img');
            imgElement.src = `${imgList[i]}.jpeg`;
            imageContainer.appendChild(imgElement);
            imgElement.style.width='250px';
            imgElement.style.height = '150px';
            imageContainer.appendChild(imgElement);
        }

        // Show the image container
        imageContainer.classList.remove('hidden');
    } else {
        alert('Please enter a valid budget!');
    }
});
