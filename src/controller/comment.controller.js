const { Comments } = require('../../models');

// 댓글 등록
exports.PostComment = async (req, res) => {
    if(req.body.contents == "" || req.body.contents == null){
        res.status(401).json({
            "error": "contents키 값이 비어있거나 키가 없습니다"
        })
    } else{
        try{
            const { contents } = req.body;
            const comment = await Comments.create({
                contents,
                todoId: req.params.id
            });
            
            const responseJson = {};
            responseJson.id = comment.id;
            responseJson.contents = comment.contents;
            responseJson.createdAt = comment.createdAt;
            responseJson.updatedAt = comment.updatedAt;
        
            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }
    }
}

// 댓글 목록
exports.GetComments = async (req, res) => {
    try{
        const comment = await Comments.findAll({
            where:{ todoId: req.params.id }
        });
    
        const responseJson = new Array;
        for(let i = 0; i<comment.length; ++i){
            responseJson.push({});
            responseJson[i].id = comment[i].id;
            responseJson[i].contents = comment[i].contents;
            responseJson[i].createdAt = comment[i].createdAt;
            responseJson[i].updatedAt = comment[i].updatedAt;
        }
    
        res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
}

// 댓글 읽기
exports.ReadSelectedComment = async (req, res) => {
    try{
        const comment = await Comments.findOne({
            where: {
                id: req.params.commentId,
                todoId: req.params.todoId
            }
        });
        if(comment == null){
            res.status(404).json({
                "error": "해당 id의 comment가 없습니다"
            })
        } else{
            const responseJson = {};
            responseJson.id = comment.id;
            responseJson.contents = comment.contents;
            responseJson.createdAt = comment.createdAt;
            responseJson.updatedAt = comment.updatedAt;
        
            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
}

// 댓글 수정
exports.ModifyComment = async (req, res) => {
    const { contents } = req.body;
    if(contents == null){
        res.status(401).json({
            "error": "content가 비었거나 Key가 틀렸습니다"
        });
    } else{
        try{
            await Comments.update({
                contents
            }, {
                where: {
                    id: req.params.commentId,
                    todoId: req.params.todoId
                }
            });
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }
    
        // 출력
        try{
            const comment = await Comments.findOne({
                where: {
                    id: req.params.commentId,
                    todoId: req.params.todoId
                }
            });
        
            const responseJson = {};
            responseJson.id = comment.id;
            responseJson.contents = comment.contents;
            responseJson.createdAt = comment.createdAt;
            responseJson.updatedAt = comment.updatedAt;
        
            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }
    }
}

// 댓글 삭제
exports.DeleteComment = async (req, res) => {
    try{
        const comment = await Comments.findOne({
            where: {
                id: req.params.commentId,
                todoId: req.params.todoId
            }
        });
        if(comment == null){
    
        } else{
            await Comments.destroy({
                where: {
                    id: req.params.commentId,
                    todoId: req.params.todoId
                }
            });
    
            res.status(200).json({
                "msg": "success"
            });
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
}