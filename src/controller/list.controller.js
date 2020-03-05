const { Todo, Tags, TodoTags } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

// 할 일 등록
exports.PostTodoList = async (req, res) => {
    const { title, description, tags } = req.body;
    if(title == null || title == ""){
        return res.status(400).json({
            "error": "title 입력은 필수입니다."
        });
    } else if(description == null || description == ""){
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
                },
                order: [
                    [Tags, TodoTags, 'id']
                ]
            });
            
            responseJson.id = todoCheck.id;
            responseJson.title = todoCheck.title;
            responseJson.description = todoCheck.description;
            responseJson.tags = [];
            if(tags){
                for(let i = 0; i<todoCheck.tags.length; ++i){
                    responseJson.tags.push(todoCheck.tags[i].title);
                }
            }
            responseJson.isCompleted = todoCheck.isCompleted;
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
}

// 할 일 목록
exports.GetTodoLists =  async (req, res) => {
    if(req.query.order){ // 정렬
        console.log(Object.keys(req.query.order));
        const key = Object.keys(req.query.order)[0];
        const value = req.query.order[key];
        console.log(value);
        try{
            const todo = await Todo.findAll({
                include:{
                    model: Tags,
                    through:{ attributes: [] }
                },
                order: [
                    [key, value],
                    [Tags, TodoTags, 'id']
                ]
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
                    responseJson[i].isCompleted = todo[i].isCompleted;
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
    } else if(req.query.title){ // title 검색
        try{
            const todo = await Todo.findAll({ 
                where: { title: {
                    [Op.like]: req.query.title
                }},
                include: {
                    model: Tags,
                    through:{ attributes: [] }
                },
                order: [
                    ['id', 'ASC'],
                    [Tags, TodoTags, 'id']
                ]
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
                    responseJson[i].isCompleted = todo[i].isCompleted;
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
    } else if(req.query.description){ // description 검색
        try{
            const todo = await Todo.findAll({ 
                where: { title: {
                    [Op.like]: req.query.description
                }},
                include: {
                    model: Tags,
                    through:{ attributes: [] }
                },
                order: [
                    ['id', 'ASC'],
                    [Tags, TodoTags, 'id']
                ]
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
                    responseJson[i].isCompleted = todo[i].isCompleted;
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
    } else if(req.query.tags){ // tags 검색
        try{
            //일단 검색하려는 태그에 해당하는 todolist 검색
            const todoJustHaveFindedTag = await Todo.findAll({ 
                include: [{
                    model: Tags,
                    where:{
                        title: {[Op.in]: req.query.tags}
                    },
                    through:{ attributes: [] }
                }],
                order: [
                    ['id', 'ASC'],
                    [Tags, TodoTags, 'id']
                ]
            });

            // 검색하려는 태그를 가진 todolist id 배열에 저장
            const id = new Array;
            for(let i = 0; i<todoJustHaveFindedTag.length; ++i){
                id.push(todoJustHaveFindedTag[i].id);
            }
            
            // 해당 todolist 전체 데이터 로드
            // 정말 신기하게 todoJustHaveFindedTag는 검색된 todolist가 tag를 3개를 가지고 있어도
            // WHERE tags in [tag1, tag2]에서 [tag1, tag2]에 들어있는 tag만 가지게 된다.
            // 그래서 검색된 id를 이용하여 재검색을 해준다.
            const todo = await Todo.findAll({
                where:{ 
                    id
                },
                include:{
                    model:Tags,
                    through:{ attributes: [] }
                },
                order: [
                    [Tags, TodoTags, 'id']
                ]
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
                    responseJson[i].isCompleted = todo[i].isCompleted;
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
        
    } else{ // 전체 목록
        try{
            const todo = await Todo.findAll({
                include:{
                    model: Tags,
                    through:{ attributes: [] }
                },
                order: [
                    ['id', 'ASC'],
                    [Tags, TodoTags, 'id']
                ]
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
                    responseJson[i].isCompleted = todo[i].isCompleted;
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
    }
}

// 할 일 읽기
exports.ReadSelectedTodoList = async (req, res) => {
    try{
        const findTodo = await Todo.findOne({ 
            where: { id: req.params.id },
            include: {
                model: Tags,
                through:{ attributes: [] }
            },
            order: [
                [Tags, TodoTags, 'id']
            ]
        });
        if(findTodo == null){
            res.status(404).json({
                "error": "해당 게시물이 존재하지 않습니다"
            })
        } else {
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
            responseJson.isCompleted = findTodo.isCompleted;
            responseJson.createdAt = findTodo.createdAt;
            responseJson.updatedAt = findTodo.updatedAt;

            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
}

// 할 일 수정
exports.ModifyTodoList = async (req, res) => {
    const { title, description, tags } = req.body;
    
    if((title == null) && (description == null) && (tags == null)){
        res.status(401).json({
            "error": "body가 비어있거나 Key값이 틀렸습니다."
        });
    } else {
        try{
            let checkExistId = await Todo.findOne({
                where: { id: req.params.id }
            });
            if(checkExistId == null){
                res.status(404).json({
                    "error": "해당 게시물이 존재하지 않습니다"
                })
            } else{
                // 제목이 들어왔다면 수정
                if(title){
                    await Todo.update({
                        title
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                }
        
                // 설명이 들어왔다면 수정
                if(description){
                    await Todo.update({
                        description
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                }
                
                // 태그가 들어왔다면 수정
                if(tags){
                    const todo = await Todo.findOne({ 
                        where: { id: req.params.id },
                        include: {
                            model: Tags,
                            through:{ attributes: [] }
                        }
                    });
        
                    if(todo.tags){
                        const tagsToArray = new Array;
                        for(let i = 0; i<todo.tags.length; ++i){
                            tagsToArray.push(todo.tags[i].title);
                        }
                        console.log(tagsToArray);
                        const originTags = await Promise.all(tagsToArray.map(tag => Tags.findAll({
                            where: {
                                title: tag
                            }
                        })));
                        await todo.removeTags(originTags.map(r => r[0]));
                    }
                
                    const inputTags = await Promise.all(tags.map(tag => Tags.findOrCreate({
                        where: {
                            title: tag
                        }
                    })));
                    await todo.addTags(inputTags.map(r => r[0]));
                }
            }
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }
    
        // 출력
        try{
            const findTodo = await Todo.findOne({ 
                where: { id: req.params.id },
                include: {
                    model: Tags,
                    through:{ attributes: [] }
                },
                order: [
                    [Tags, TodoTags, 'id']
                ]
            });
            
            if(findTodo == null){
                res.status(404).json({
                    "error": "해당 게시물이 존재하지 않습니다"
                })
            } else{
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
                responseJson.isCompleted = findTodo.isCompleted;
                responseJson.createdAt = findTodo.createdAt;
                responseJson.updatedAt = findTodo.updatedAt;
        
                res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
            }
        } catch(error){
            console.error(error);
            res.status(500).json({
                "error": error
            });
        }
    }
}

// 할 일 완료
exports.CompleteTodoList = async (req, res) => {
    try{
        let checkExistId = await Todo.findOne({
            where: { id: req.params.id }
        });
        if(checkExistId == null){
            res.status(404).json({
                "error": "해당 게시물이 존재하지 않습니다"
            })
        } else{
            await Todo.update({
                isCompleted: true
            }, {
                where: {
                    id: req.params.id
                }
            });
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }

    // 출력
    try{
        const findTodo = await Todo.findOne({ 
            where: { id: req.params.id },
            include: {
                model: Tags,
                through:{ attributes: [] }
            },
            order: [
                [Tags, TodoTags, 'id']
            ]
        });

        if(findTodo == null){
            res.status(404).json({
                "error": "해당 게시물이 존재하지 않습니다"
            })
        } else{
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
            responseJson.isCompleted = findTodo.isCompleted;
            responseJson.createdAt = findTodo.createdAt;
            responseJson.updatedAt = findTodo.updatedAt;

            res.status(200).json(JSON.parse(JSON.stringify(responseJson)));
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": error
        });
    }
}

// 할 일 삭제
exports.DeleteTodoList = async (req, res) => {
    try{
        let checkExistId = await Todo.findOne({
            where: { id: req.params.id }
        });
        if(checkExistId == null){
            res.status(404).json({
                "error": "해당 게시물이 존재하지 않습니다"
            })
        } else{
            await Todo.destroy({where: {id: req.params.id}});

            res.status(200).json({
                "msg": "success"
            });
        }
    } catch(error){
        console.error(error);
        res.status(500).json({
            "error": "해당 id의 todo가 없습니다"
        });
    }
}