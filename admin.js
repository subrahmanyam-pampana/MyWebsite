//adding new question
//if request.auth != null
var storageRef = storage.ref();
var file;

function fnLoadFile(event) {
    file = event.target.files[0];
    console.log(file);
}

function uploadFile() {
    console.log(storageRef);
    var imagesRef = storageRef.child('images');
    var imageRef = imagesRef.child('demoImage.png');
    console.log(imageRef);
    console.log(file);
    imageRef.put(file).then((snapshot) => {
        alert.log('Uploaded a blob or file!');
    }).catch((error) => {
        alert(error);
    });

}

var form = document.getElementById("addNewQuestionForm");
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.question.value == '') {
        alert("Please enter Question");
        return;
    } else {

        var list = $("#add_opt_list li");
        console.log(list);
        var options = [];
        for (let i = 0; i < list.length; i++) {
            options.push($(list).eq(i).find("input").val());
        }

        console.log(options);

        db.collection('questions').add({
            question: form.question.value,
            options: options,
            answer: form.answer.value,
            solution: form.solution.value,
            subject: form.subject.value,
            type: form.type.value,
            year: form.year.value
        }).then((docRef) => {
            alert("question added successfully with doc id: " + docRef.id);
        }).catch((error) => {
            alert("Error occured while Addeding new document. Error: " + error);
        });

    }
});