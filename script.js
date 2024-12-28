document.getElementById('filterButton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action of the button
  
    const budget = document.getElementById('budget').value;
    const imageContainer = document.querySelector('.image-container');

    // Clear previous images
    imageContainer.innerHTML = '';
    
    if (budget > 0) {
        const imagesToShow = Math.min(Math.floor(budget / 100000), 24); // 1 image per $100, max 5 images
        
        // List of images from a.png to k.png
        const imgList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        
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
