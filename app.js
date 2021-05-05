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

        let div = document.createElement('div');
        div.setAttribute('class', 'quetionDiv');
        div.setAttribute('id', doc.id);

        let question = document.createElement('p');
        let qno = document.createElement('span');
        qno.innerHTML = quetionNum + ". ";
        question.appendChild(qno);
        let queText = document.createElement('span');
        queText.innerHTML = doc.data().quetion;
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
        solPtag.innerHTML = 'Solution: ' + doc.data().solution;

        let noteTag = document.createElement('textarea');
        noteTag.setAttribute('class', 'userNote');
        noteTag.setAttribute('placeholder', 'take your notes here');
        noteTag.setAttribute('value', doc.data().note);

        soldiv.appendChild(solPtag);
        soldiv.appendChild(noteTag);

        //appending all the elements to div
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
