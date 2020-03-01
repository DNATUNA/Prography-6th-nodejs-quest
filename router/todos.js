const express = require('express');
const router = express.Router();

const { Todo, Tags } = require('../models');

// 할 일 등록
router.post('/', async (req, res) => {
    const { title, description, tags } = req.body;
    if(title == null){
        return res.status(400).json({
            "error": "title 입력은 필수입니다."
        });
    } else if(description == null){
        return res.status(400).json({
            "error": "description 입력은 필수입니다."
        });
    } else{
        try{
            // 투두 리스트 추가
            const todo = await Todo.create({
                title,
                description,
            });
            // 태그 등록
            if(tags){
                const inputTags = await Promise.all(tags.map(tag => Tags.findOrCreate({
                    where: {
                        title: tag
                    }
                })));
                await todo.addTags(inputTags.map(r => r[0]));
            }

            // response json 만들기
            const responseJson = {};
            const todoCheck = await Todo.findOne({ 
                where: { title, createdAt: todo.createdAt },
                include: {
                    model: Tags,
                    through:{ attributes: [] }
                }
            });
            
            responseJson.id = todoCheck.id;
            responseJson.title = todoCheck.title;
            responseJson.description = todoCheck.description;
            responseJson.tags = new Array;
            if(tags){
                for(let i = 0; i<todoCheck.tags.length; ++i){
                    responseJson.tags.push(todoCheck.tags[i].title);
                }
            }
            responseJson.createdAt = todoCheck.createdAt;
            responseJson.updatedAt = todoCheck.updatedAt;

            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }    
    }
});

// 할 일 목록
router.get('/', async (req, res) => {
    try{
        const todo = await Todo.findAll({
            include:{
                model: Tags,
                through:{ attributes: [] }
            }
        });
    
        const responseJson = new Array;
        for(let i = 0; i<todo.length; ++i){
            responseJson.push({});
            responseJson[i].id = todo[i].id;
                responseJson[i].title = todo[i].title;
                responseJson[i].description = todo[i].description;
                responseJson[i].tags = new Array;
                if(todo[i].tags){
                    for(let j = 0; j<todo[i].tags.length; ++j){
                        responseJson[i].tags.push(todo[i].tags[j].title);
                    }
                }
                responseJson[i].createdAt = todo[i].createdAt;
                responseJson[i].updatedAt = todo[i].updatedAt;
        }
    
        res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
});

// 할 일 읽기
router.get('/:id', async (req, res) => {
    try{
        const findTodo = await Todo.findOne({ 
            where: { id: req.params.id },
            include: {
                model: Tags,
                through:{ attributes: [] }
            }
        });

        const responseJson = {};
        responseJson.id = findTodo.id;
        responseJson.title = findTodo.title;
        responseJson.description = findTodo.description;
        responseJson.tags = new Array;
        if(findTodo.tags){
            for(let i = 0; i<findTodo.tags.length; ++i){
                responseJson.tags.push(findTodo.tags[i].title);
            }
        }
        responseJson.createdAt = findTodo.createdAt;
        responseJson.updatedAt = findTodo.updatedAt;

        res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
});

// 할 일 수정
router.put('/:id', async (req, res) => {
    if(req.body.title == null) {

    } else {
        Tags.up
    }

    if(req.body.description == null) {

    } else {

    }

    if(req.body.tags == null) {

    } else {

    }
});
module.exports = router;