const express = require('express');
const router = express.Router();

// 컨트롤러 선언
const listController = require('../controller/list.controller');
const commentController = require('../controller/comment.controller');

// @@ 할 일 기능들 @@ //
// 할 일 등록
router.post('/', listController.PostTodoList);

// 할 일 목록 + 추가 과제 < 정렬 >
router.get('/', listController.GetTodoLists);

// 할 일 읽기
router.get('/:id', listController.ReadSelectedTodoList);

// 할 일 수정
router.put('/:id', listController.ModifyTodoList);

// 할 일 완료
router.put('/:id/complete', listController.CompleteTodoList);

// 할 일 삭제
router.delete('/:id', listController.DeleteTodoList);


// @@ 댓글 기능들 @@ //
// 댓글 등록
router.post('/:id/comments', commentController.PostComment);

// 댓글 목록
router.get('/:id/comments', commentController.GetComments);

// 댓글 읽기
router.get('/:todoId/comments/:commentId', commentController.ReadSelectedComment);

// 댓글 수정
router.put('/:todoId/comments/:commentId', commentController.ModifyComment);

// 댓글 삭제
router.delete('/:todoId/comments/:commentId', commentController.DeleteComment);

module.exports = router;