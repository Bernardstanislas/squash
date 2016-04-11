const Firebase = require('firebase');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

const firebaseRef = new Firebase('https://squanalytics.firebaseio.com');
const pointsRef = firebaseRef.child('points');
const stanPointsRef = pointsRef.child('stan');
const arthurPointsRef = pointsRef.child('arthur');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function (req, res) {
    const currentTime = new Date();
    const player = req.body.player;
    const increment = JSON.parse(req.body.increment);

    const respond = error => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json('ok');
        }
    };

    if (increment) {
        switch(player) {
            case 'stan':
                stanPointsRef.push().set({time: currentTime.getTime()}, respond);
                break;
            case 'arthur':
                arthurPointsRef.push().set({time: currentTime.getTime()}, respond);
                break;
            default:
                res.status(404).json(`${player} does not exist`);
        }
    } else {
        switch(player) {
            case 'stan':
                stanPointsRef.orderByKey().limitToLast(1).once('child_added', snap => {
                    snap.ref().remove(respond);
                });
                break;
            case 'arthur':
                arthurPointsRef.orderByKey().limitToLast(1).once('child_added', snap => {
                    snap.ref().remove(respond);
                });
                break;
            default:
                res.status(404).json(`${player} does not exist`);
        }
    }
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
