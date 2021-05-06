var quetionNum = 1;
window.onload = () => {
    getdata();

}

function fnshowHide(e) {
    if ($(e).val() == "H") {
        $(e).siblings('.solution-div').show();
        $(e).text("Hide Solution");
        $(e).val("S");
    } else if ($(e).val() == "S") {
        $(e).siblings('.solution-div').hide();
        $(e).text("View Solution");
        $(e).val("H");
    }
}

function fnSelectOption(e) {
    $(e).siblings().removeClass("selectedOption");
    $(e).addClass("selectedOption");
}

function fnrenderQuetions(doc) {

    if (doc.data().type == "mcq") {
        var opnNum = ['A', 'B', 'C', 'D', 'F', 'G', 'H'];

        //quetion div
        let div = document.createElement('div');
        div.setAttribute('class', 'quetionDiv');
        div.setAttribute('id', doc.id);

        //delete tag
        let delTag = document.createElement('p');
        delTag.setAttribute('class', 'delQuetion');
        delTag.setAttribute('onclick', 'fnDelQuestion(this)');
        delTag.innerHTML = 'x';

        //quetion number tag
        let question = document.createElement('p');
        let qno = document.createElement('span');
        qno.innerHTML = quetionNum;
        qno.setAttribute('class', 'option-text qno')
        question.appendChild(qno);

        //question text tag
        let queText = document.createElement('span');
        queText.innerHTML = doc.data().quetion;
        queText.setAttribute('onclick', 'fnEditText(this)');

        question.appendChild(queText);

        //table
        var table = document.createElement('table');
        var options = doc.data().options.split(',');

        options.forEach((optn, index) => {
            let optnTr = document.createElement('tr');
            optnTr.setAttribute('class', 'option-tr');
            optnTr.setAttribute('onclick', 'fnSelectOption(this)');


            //option lable
            let optnTd1 = document.createElement('td');
            optnTd1.setAttribute('class', 'option-text');
            optnTd1.innerHTML = opnNum[index];
            optnTr.appendChild(optnTd1);

            //option text
            let optnTd2 = document.createElement('td');
            optnTd2.innerHTML = optn;
            optnTr.appendChild(optnTd2);

            table.appendChild(optnTr);

        });
        //check button
        let checkbtn = document.createElement('button');
        checkbtn.addEventListener('click', fnCheckAnswer(this));
        checkbtn.setAttribute('class', 'button view');
        checkbtn.innerHTML = "Check Answer"

        //view solution button
        let viewbtn = document.createElement('button');
        viewbtn.setAttribute('class', 'button viewSolbtn');
        viewbtn.setAttribute('value', 'H');
        viewbtn.innerHTML = "View Solution";
        viewbtn.setAttribute('onclick', 'fnshowHide(this)');


        //solution div
        let soldiv = document.createElement('div');
        soldiv.setAttribute('class', 'solution-div');

        let solPtag = document.createElement('p');

        //solution lable tag
        let solLabTag = document.createElement('span');
        solLabTag.innerHTML = 'Solution: ';
        solLabTag.setAttribute('class', 'solLab');

        //sulution span tag
        let solStag = document.createElement('span');
        solStag.innerHTML = doc.data().solution;
        solStag.setAttribute('onclick', 'fnEditText(this)');

        //appending to solution p tag
        solPtag.appendChild(solLabTag);
        solPtag.appendChild(solStag);

        let noteTag = document.createElement('textarea');
        noteTag.setAttribute('class', 'userNote');
        noteTag.setAttribute('placeholder', 'take your notes here');
        noteTag.setAttribute('value', doc.data().note);

        soldiv.appendChild(solPtag);
        soldiv.appendChild(noteTag);

        //appending all the elements to div
        div.appendChild(delTag);
        div.appendChild(question);
        div.appendChild(table);
        div.appendChild(checkbtn);
        div.appendChild(viewbtn);
        div.appendChild(soldiv);

        let parent = document.getElementById("parentDiv")
        parent.appendChild(div);
        quetionNum++;
    }
}

function getdata() {
    db.collection('quetions').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            fnrenderQuetions(doc);
        })
    });

}

var form = document.getElementById("addNewQuetionForm");
form.addEventListener('submit', (event) => {
    event.preventDefault();
    db.collection('quetions').add({
        quetion: form.quetion.value,
        options: form.options.value,
        answer: form.answer.value,
        solution: form.solution.value,
        subject: form.subject.value,
        type: form.type.value
    });
    $("#leftPannel").empty();
    getdata();
});



function fnCheckAnswer(e) {
    console.log("check answer");

}

function fnDelQuestion(e) {
    if (confirm("Do you want to delete question")) {
        let id = $(e).parent().attr("id");
        if (id) {
            db.collection('quetions').doc(id).delete();
            $(e).parent().remove();
        }
    }

}

function fnEditText(e) {
    var text = $(e).text();
    var parentDiv = document.createElement('div');
    parentDiv.setAttribute('class', 'edit-par-div');

    var inputTag = document.createElement('textarea');
    inputTag.value = text;
    inputTag.setAttribute('class', 'editTextArea');

    let saveTag = document.createElement('i');
    saveTag.setAttribute('class', 'fas fa-check undoChange');
    saveTag.setAttribute('onclick', 'fnSaveChages(this)');

    let undoTag = document.createElement('i');
    undoTag.setAttribute('class', 'fas fa-times undoChange');

    // undoTag.setAttribute('onclick', "fnUndoChages(this)");

    $(undoTag).click(() => {

        fnUndoChages(event, text);

    });


    parentDiv.appendChild(inputTag);
    parentDiv.appendChild(saveTag);
    parentDiv.appendChild(undoTag);

    $(e).parent().append(parentDiv);
    $(e).remove();
}

function fnSaveChages(e) {

    var text = $(e).siblings('.editTextArea').val();
    console.log(text);
    var spanTag = document.createElement('span');
    spanTag.innerHTML = text;
    spanTag.setAttribute('onclick', 'fnEditText(this)');
    $(e).parent().append(spanTag);
    $(e).parent().parent().append(spanTag);

    $(e).parent().remove();

}

function fnUndoChages(event, text) {
    var e = event.target;
    var spanTag = document.createElement('span');
    spanTag.innerHTML = text;

    spanTag.setAttribute('onclick', 'fnEditText(this)');
    $(e).parent().parent().append(spanTag);
    $(e).parent().remove();

}
