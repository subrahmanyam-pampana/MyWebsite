var questionNum = 1;
window.onload = () => {
    getdata('all');
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

        //question div
        let div = document.createElement('div');
        div.setAttribute('class', 'questionDiv');
        div.setAttribute('id', doc.id);

        //delete tag
        let delTag = document.createElement('p');
        delTag.setAttribute('class', 'delQuetion');
        delTag.setAttribute('onclick', 'fnDelQuestion(this)');
        delTag.innerHTML = 'x';

        //question number tag
        let question = document.createElement('p');
        question.setAttribute('name', 'question');
        let qno = document.createElement('span');
        qno.innerHTML = questionNum;
        qno.setAttribute('class', 'option-text qno')
        question.appendChild(qno);

        //question text tag
        let queText = document.createElement('span');
        queText.innerHTML = doc.data().question;
        queText.setAttribute('onclick', 'fnEditText(this)');

        question.appendChild(queText);

        //table
        var table = document.createElement('table');
        table.setAttribute('answer', doc.data().answer)
        var options = doc.data().options;

        options.forEach((optn, index) => {
            let optnTr = document.createElement('tr');
            optnTr.setAttribute('class', 'option-tr');
            optnTr.setAttribute('option_value', opnNum[index]);
            optnTr.setAttribute('onclick', 'fnSelectOption(this)');


            //option lable
            let optnTd1 = document.createElement('td');
            optnTd1.setAttribute('class', 'option-text');
            optnTd1.innerHTML = opnNum[index];
            optnTr.appendChild(optnTd1);

            //option text
            let optnTd2 = document.createElement('td');
            optnTd2.innerHTML = optn;
            optnTd2.setAttribute('class', 'option_text_lab')
            optnTr.appendChild(optnTd2);
            table.appendChild(optnTr);

        });

        //year div 
        let yearDiv = document.createElement('div');
        yearDiv.setAttribute('class', 'year_div');
        yearDiv.innerHTML = doc.data().year;

        //check button
        let checkbtn = document.createElement('button');
        checkbtn.setAttribute('onclick', 'fnCheckAnswer(this)');
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
        // soldiv.setAttribute('answer', doc.data().answer);

        let solPtag = document.createElement('p');
        solPtag.setAttribute('name', 'solution');

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
        div.appendChild(yearDiv);
        div.appendChild(checkbtn);
        div.appendChild(viewbtn);
        div.appendChild(soldiv);

        let parent = document.getElementById("parentDiv")
        parent.appendChild(div);
        questionNum++;
    }
}

function getdata(subject) {
    //where('subject', '==', 'machines').
    questionNum = 1;
    $("#parentDiv").empty();
    if (subject == 'all') {

        db.collection('questions').orderBy('question').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                fnrenderQuetions(doc);
            })
        });
    } else {
        db.collection('questions').where('subject', '==', subject).orderBy('question').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                fnrenderQuetions(doc);
            })
        });

    }


}

// real time updates
//db.collection('questions').onSnapshot(snapshot => {
//     //sanpshot has collection reference
//     //changes have changed document ref
//     //it has type added,removed
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         //change has change  document reference
//         if (change.type == "added") {
//             fnrenderQuetions(change.doc);
//         } else if (change.type = 'removed') {
//             let queDiv = $("#parentDiv").find("[id=" + change.doc.id + "]");
//             $(queDiv).remove();
//         }

//     });

// });

function fnDelQuestion(e) {
    if (confirm("Do you want to delete question")) {
        let id = $(e).parent().attr("id");
        if (id) {
            db.collection('questions').doc(id).delete().then(() => {
                $(e).parent().remove();
            }).catch((error) => {
                alert('Error: ' + error);
            });
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
    // inputTag.setAttribute('data-id', 'editTextArea');

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
    var id = $(e).parents('div .questionDiv').attr('id');
    var property = $(e).parents('p').attr('name');
    console.log(id);
    console.log(property);
    var spanTag = document.createElement('span');
    spanTag.innerHTML = text;

    spanTag.setAttribute('onclick', 'fnEditText(this)');
    if (property == 'question') {
        db.collection('questions').doc(id).update({
            question: text
        }).then((docRef) => {
            displayMsg("S", "Quetion updated successfully ");

        }).catch((error) => {
            displayMsg("E", "Error");
            console.log("Error: " + error);
        });

        $(e).parent().append(spanTag);
        $(e).parent().parent().append(spanTag);
        $(e).parent().remove();

    } else if (property == 'solution') {
        db.collection('questions').doc(id).update({
            solution: text
        }).then((docRef) => {
            displayMsg("S", "Solution updated successfully ");
        }).catch((error) => {
            displayMsg("E", "Error");
            console.log("Error: " + error);
        });

        $(e).parent().append(spanTag);
        $(e).parent().parent().append(spanTag);
        $(e).parent().remove();
    }
}

function fnUndoChages(event, text) {
    var e = event.target;
    var spanTag = document.createElement('span');
    spanTag.innerHTML = text;

    spanTag.setAttribute('onclick', 'fnEditText(this)');
    $(e).parent().parent().append(spanTag);
    $(e).parent().remove();

}

$("#add_opt_btn").click(() => {
    let ul = document.createElement('li');
    let input = document.createElement('input');
    $(ul).append(input);
    $("#add_opt_list").append(ul);

});

function fnCheckAnswer(element) {
    console.log($(element));
    var e = $(element).siblings('table').find('.selectedOption');
    console.log("check answer");
    let selOptn = $(e).attr('option_value');
    let answer = $(e).parent('table').attr('answer');
    // console.log(selOptn);
    // console.log(answer);

    if (selOptn != answer) {
        $(e).css('background-color', 'rgba(255, 3, 0, .17)');
        $(e).find('.option-text').css('background-color', 'red');
        $(e).find('.option_text_lab').css('color', 'red');
    }

    var rows = $(e).parent().find('tr');
    console.log(rows);

    for (let i = 0; i < rows.length; i++) {

        let optn = $(rows[i]).attr('option_value');
        console.log(optn);
        console.log("answer:" + answer);
        if (optn == answer) {
            $(rows[i]).css('background-color', 'rgba(0,255,109,.17)');
            $(rows[i]).find('.option_text_lab').css('color', 'green');
            $(rows[i]).find('.option-text').css('background-color', 'green');
        }
    }

}

function displayMsg(type, msg) {

    $("#infoMsg").text(msg);
    if (type == "E") {
        $("#infoMsg").css({
            "background-color": "red",
            "color": "red",
            "display": "block"
        });
    } else if (type == "S") {
        $("#infoMsg").css({
            "background-color": "#00ff141f",
            "color": "green",
            "display": "block"
        });
    }

    setTimeout(() => {
        $("#infoMsg").hide();
    }, 5000);
}
