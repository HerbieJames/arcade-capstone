const editButtons = document.getElementsByClassName("btn-edit");
const deleteButtons = document.getElementsByClassName("btn-delete");
const scoreForm = document.getElementById("gameDisplayEl");
const submitButton = document.getElementById("submitBtnEl");

/**
* Initializes edit functionality for the provided edit buttons.
* 
* For each button in the `editButtons` collection:
* - Retrieves the associated score's ID upon click.
* - Fetches the alias of the corresponding score.
* - Populates the `scoreAlias` input/textarea with the score's alias for editing.
* - Updates the submit button's text to "Update".
* - Sets the form's action attribute to the `edit_score/{scoreId}` endpoint.
*/
for (let button of editButtons) {
  button.addEventListener("click", (e) => {
    let scoreId = e.target.getAttribute("score_id");
    let scoreAlias = document.getElementById(`score${scoreId}`).innerText;
    let scoreValue = document.getElementById(`value${scoreId}`).innerText;
    document.getElementById("id_alias").setAttribute("value", scoreAlias);
    document.getElementById("id_value").setAttribute("value", scoreValue);
    console.log("--EDITTING:--");
    console.log("ID:",scoreId);
    console.log("Alias:",scoreAlias);
    submitButton.innerText = "Update";
    startUp();
    endGame();
    document.getElementById("gameOverEl").innerHTML = "CHANGE NAME"
    document.getElementById("retryTxt").innerHTML = "PRESS ESC TO CANCEL"

    scoreForm.setAttribute("action", `edit_score/${scoreId}`);
  });
}

for (let button of deleteButtons) {
    button.addEventListener("click", (e) => {
      let scoreId = e.target.getAttribute("score_id");
      let scoreAlias = document.getElementById(`score${scoreId}`).innerText;
      let scoreValue = document.getElementById(`value${scoreId}`).innerText;
      document.getElementById("id_alias").setAttribute("value", scoreAlias);
      document.getElementById("id_alias").disabled = true;
      document.getElementById("id_value").setAttribute("value", scoreValue);
      console.log("--DELETING:--");
      console.log("ID:",scoreId);
      console.log("Alias:",scoreAlias);
      submitButton.innerText = "Delete";
      startUp();
      endGame();
      document.getElementById("gameOverEl").innerHTML = "DELETE SCORE"
      document.getElementById("retryTxt").innerHTML = "PRESS ESC TO CANCEL"
  
      scoreForm.setAttribute("action", `delete_score/${scoreId}`);
    });
  }

/*
scoreForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  console.log('action attribute: ', ev.target.getAttribute('action'));
  setTimeout(() => {
    ev.target.submit();  
  }, 1000);
  
  
});

*/