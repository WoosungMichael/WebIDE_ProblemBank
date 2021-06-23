var express = require('express');
var router = express.Router();

var db = require('../modules/db-connection');
var sql = require('../sql');
var compiler = require('../modules/compile-run');

var { PROBLEM_START_DELEMETER: startDelem, PROBLEM_END_DELEMETER: endDelem } = process.env;

router.post('/compile', async function(req, res){
    const { sourceCode, problemId, language } = req.body;
    const [testCases] = await db.query(sql.problems.selectTestCaseByProblemId, [problemId]);
    let correctCount = 0;
    let wrongList = 270;
    try {
        console.log("try 들어옴");
        const promises = testCases.map(testcase => {
            console.log("1번");
            return new Promise((resolve) => {
                console.log("2번");
                const docker = compiler.getProblemDocker(sourceCode, language);
                let isStarted = false;
                docker.stderr.on("data", (data) => {
                    console.log(data.toString('utf-8'));
                })
                console.log("3번");
                docker.stdout.on("data", (data) => {
                    if(!isStarted) return;
                    const line = data.toString('utf-8');
                    if(line.includes(testcase.output)){
                        correctCount++;
                        console.log("정답!!!");
                    }
                })
                console.log("4번");
                docker.stdout.on("data", (data) => {
                    const line = data.toString('utf-8');
                    if(line.includes(startDelem)) {
                        isStarted = true;
                        docker.stdin.write(Buffer.from(testcase.input + "\n"));
                    } else if(line.includes(endDelem)) {
                        isStarted = false;
                        resolve();
                    }
                });
            });
        })
        
        if(correctCount !== testCases.length){
            wrongList=problemId;
        }        
            

        res.status(200).send({
            result: true,
            data:  { correctCount, count: testCases.length, wrongList },
            message: 'compile success'
        })
    
        for(let i = 0 ; i < promises.length; i++) { await promises[i] } // TODO: recfectoring this
    } catch (error) {
        console.log(error)
        res.status(404).send({
            result: false,
            data: [],
            message: error
        })
    }

    // socket.emit("result", { correctCount, count: testCases.length })
    // socket.leave();
})  

router.post('/addmylist', async function(req, res){
    res.status(202).send({
        result : false,
        data: [],
        message : '문제 추가 권한이 없습니다.'
    })
})

module.exports = router;