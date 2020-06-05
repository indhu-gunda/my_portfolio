// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
$(document).ready(function(){
  $('.header').height($(window).height());

  $(".navbar a").click(function(){
    $("body,html").animate({
      scrollTop:$("#" + $(this).data('value')).offset().top
    },1000)
  
  })
})

function getComments() {
  let numCommentsPerPage = document.getElementById('num-comments').value;
  let numPages = setupPagination(numCommentsPerPage);
  numPages.then(() => {
    fetch('/list-comments?num-comments=' + numCommentsPerPage + '&page-num=' + currentPage()).then(response => response.json()).then((comments) => {
      const commentsListElement = document.getElementById('comments-container');
      commentsListElement.innerHTML = '';
      comments.forEach(comment => {
        commentsListElement.appendChild(createCommentElement(comment));
      });
    });
  });
}

async function setupPagination(numCommentsPerPage) {
  return fetch('/num-comments').then(response => response.text()).then((numCommentsString) => {
    let numComments = parseInt(numCommentsString);
    let numPages = Math.ceil(numComments/numCommentsPerPage);
    const pageSelectElement = document.getElementById('page-num');

    let savedPage = pageSelectElement.options.length > 0 ? pageSelectElement.value : 1;
    
    /* remove old options first */
    for (var i = pageSelectElement.options.length - 1; i >= 0; i--) {
      pageSelectElement.remove(i);
    }

    for(var i = 1; i <= numPages; i++) {
      const optionElement = document.createElement('option');
      optionElement.value = i;
      optionElement.innerText = i + " of " + numPages;
      pageSelectElement.appendChild(optionElement);
    }
    pageSelectElement.value = savedPage <= numPages ? savedPage : 1;
  });
}

function currentPage() {
  return document.getElementById('page-num').value;
}

/** Creates an element that represents a comment, including its delete button. */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'row align-items-center';

  const profileElement = document.createElement('i');
  profileElement.className = 'material-icons account col-lg-1 col-md-1 col-sm-1';
  profileElement.innerText = 'account_circle';

  const messageBoxElement = createMessageBoxElement(comment);
  const deleteButtonElement = createDeleteButtonElement(comment);

  commentElement.appendChild(profileElement);
  commentElement.appendChild(messageBoxElement);
  commentElement.appendChild(deleteButtonElement);
  return commentElement;
}

function createMessageBoxElement(comment) {
  const messageBoxElement = document.createElement('div');
  messageBoxElement.className = 'col-lg-10 col-md-10 col-sm-10';
  const nameElement = document.createElement('p');
  nameElement.className = 'name';
  nameElement.innerText = comment.name;
  const messageElement = document.createElement('p');
  messageElement.className = 'message';
  messageElement.innerText = comment.message;
  messageBoxElement.appendChild(nameElement);
  messageBoxElement.appendChild(messageElement);
  return messageBoxElement;
}

function createDeleteButtonElement(comment) {
  const deleteButtonElement = document.createElement('button');
  const deleteIconElement = document.createElement('i');
  deleteIconElement.className = 'material-icons delete col-lg-1 col-md-1 col-sm-1';
  deleteIconElement.innerText = 'close';
  deleteButtonElement.appendChild(deleteIconElement);

  deleteButtonElement.addEventListener('click', () => {
    deleteComment(comment);
    commentElement.remove();
  });
  return deleteButtonElement;
}

/** Tells the server to delete the comment. */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append('id', comment.id);
  fetch('/delete-comment', {method: 'POST', body: params});
}

