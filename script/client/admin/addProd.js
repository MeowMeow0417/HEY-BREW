function resetForm(){
    document.getElementById('addProductForm').reset();
    document.getElementById('uploadStatus').innerText();
}

function confirmCancel(){
    let confirmation = confirm("Are you sure?");
    if(confirmation){
        resetForm();
    }
}


function addConfirm() {
    let confirmation = confirm("Are you sure?");
    if(confirmation){
        resetForm();
    }
}



// Get the drop area and the file input
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('imageUpload');

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => fileInput.click()); // Click to open file dialog

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    const file = fileInput.files[0];
    if (file) {
        displayFileName(file);
    }
}

function displayFileName(file) {
    dropArea.querySelector('p').textContent = file.name; // Display the file name
}

// Prevent default behavior (Prevent file from being opened)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight the drop area when dragging files over it
dropArea.addEventListener('dragover', () => {
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => fileInput.click()); // Click to open file dialog

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        fileInput.files = files; // Set the file input's files
        dropArea.querySelector('p').textContent = file.name; // Display the file name
    }
}
