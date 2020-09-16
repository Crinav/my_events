const express = require('express');
const bodyParser = require('body-parser');

function createRouter(db) {
  const router = express.Router();
  router.use(bodyParser.json()); 
  router.use(bodyParser.urlencoded({ extended: true }));

  //list les users
  router.get('/api/users', function (req, res, next) {
    db.query(
      'SELECT * FROM users',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });
  // enregistre un nouveau user
  router.post('/api/new_user', (req, res, next) => {
    db.query(
      'INSERT INTO users (id_fb, pseudo, mail, avatar, description) VALUES (?,?,?,?,?)',
      [req.body.id_fb, req.body.pseudo, req.body.mail, req.body.avatar, req.body.description],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });
  // info sur un user par mail
  router.get('/api/usermail/:mail', function (req, res, next) {
    db.query(
      'SELECT * FROM users WHERE mail=?',
       [req.params.mail],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);
        }
      } 
    );
  });

// info sur un user par id
router.get('/api/userid/:id', function (req, res, next) {
  db.query(
    'SELECT * FROM users WHERE id=?',
     [req.params.id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({status: 'error'});
      } else { 
        res.status(200).json(results);  
      }  
    } 
  );  
});


  // info sur un user par pseudo
  router.get('/api/userpseudo/:pseudo', function (req, res, next) {
    db.query(
      'SELECT * FROM users WHERE pseudo=?',
       [req.params.pseudo],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // info sur un user par mail
  router.get('/api/user/:mail', function (req, res, next) {
    db.query(
      'SELECT * FROM users WHERE mail=?',
       [req.params.mail],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // update un user
  router.put('/api/update_user/:id', function (req, res, next) {
    db.query(
      'UPDATE users SET pseudo=?, avatar=?, description=? WHERE id=?', 
      [req.body.pseudo, req.body.avatar, req.body.description, req.params.id, ],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'}); 
        }  
      } 
    );  
  });

  // delete un user
  router.delete('/api/user/:id', function (req, res, next) {
    db.query(
      'DELETE FROM users WHERE id=?',
      [req.params.id],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'}); 
        }  
      } 
    );  
  });

  // toutes les sorties
  router.get('/api/events', function (req, res, next) {
    db.query(
      'SELECT * FROM events where 1',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // les sorties public organisées pour un event
  router.get('/api/event/:id_event', function (req, res, next) {
    db.query(
      'SELECT * FROM events where id_event=? AND visibility=0',
      [req.params.id_event],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // sorties public organisées pour un id_eventful
  router.get('/api/eventful/:id_eventful', function (req, res, next) {
    db.query(
      'SELECT * FROM events where id_eventful=?',
      [req.params.id_eventful],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // les sorties privées organisées pour un event
  router.get('/api/eventPrivate/:id_event', function (req, res, next) {
    db.query(
      'SELECT * FROM events where id_event=? AND visibility=1',
      [req.params.id_event],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // les sorties d'un org en public
  router.get('/api/events_org/:id_org', function (req, res, next) {
    db.query(
      'SELECT * FROM events where id_org=? AND visibility=0',
      [req.params.id_org],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });


  // Créer une sortie
  router.post('/api/new_event', (req, res, next) => {
    db.query(
      'INSERT INTO events (id_org, id_eventful, name) VALUES (?,?,?)',
      [req.body.id_org, req.body.id_eventful, req.body.name],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
// modifier une sortie
  router.put('/api/update_event/:id_event', function (req, res, next) {
    db.query( 
      'UPDATE events SET visibility=? WHERE id_event=? AND id_org=?', 
      [req.body.visibility, req.params.id_event, req.body.id_org], 
      (error) => { 
        if (error) { 
          res.status(500).json({status: 'error'});  
        } else { 
          res.status(200).json({status: 'ok'}); 
        } 
      }  
    );
  });
  
// rajouter des amis à une sortie ou se rajouter à une sortie
  router.post('/api/new_part', function (req, res, next) {  
    db.query( 
        'INSERT INTO participants (id_member, id_event, id_org) VALUES (?,?,?)',
        [req.body.id_member, req.body.id_event, req.body.id_org], 
      (error) => { 
        if (error) { 
          res.status(500).json({status: error});  
        } else { 
          res.status(200).json({status: 'ok'}); 
        } 
      }  
    );
  });
  
// supprimer une sortie (les participants + la sortie)
  router.post('api/del_event', function (req, res, next) {
    console.log('delete')
  //   db.query(
  //       'DELETE FROM participants WHERE id_event=? AND id_org=?',
  //       [req.params.id_event, req.body.id_org],
  //       (error) => {
  //         if (error) {
  //           res.status(500).json({status: 'error'});
  //         } else {
  //           res.status(200).json({status: 'ok'});
  //         }
  //       }
  //   );
  //   db.query(
  //     'DELETE FROM events WHERE id_event=?',
  //     [req.params.id_event],
  //     (error) => {
  //       if (error) {
  //         res.status(500).json({status: 'error'});
  //       } else {
  //         res.status(200).json({status: 'ok'});
  //       }
  //     }
  // );
    
  });

  //inserer un message
  router.put('/message/:id_event', function (req, res, next) {
    db.query( 
        'INSERT INTO messages (id_member, id_event,message, date) VALUES (?,?,?,?)',
        [req.body.id_member, req.params.id_event, req.body.message, new Date(req.body.date)], 
      (error) => { 
        if (error) { 
          res.status(500).json({status: 'error'});  
        } else { 
          res.status(200).json({status: 'ok'}); 
        } 
      }  
    );
  });

  // recup les message d'un event
  router.get('/api/mess/:id_event', function (req, res, next) {
    db.query(
      'SELECT id_message, id_member, id_event, message, messages.date, id, id_fb, pseudo, avatar FROM messages INNER JOIN users ON (id) = (id_member) WHERE id_event=? ORDER BY messages.date DESC',
      [req.params.id_event],
      (error, results) => {console.log(results)
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  // liste des paticipants à un event + info de event
  router.get('/api/part/:id_event', function (req, res, next) {
    db.query(
      'SELECT * FROM participants INNER JOIN events USING (id_event) WHERE id_event=?',
      [req.params.id_event],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

  router.get('/api/myPart/:id_member', function (req, res, next) {
    db.query(
      'SELECT * FROM participants INNER JOIN events USING (id_event) WHERE id_member=?',
      [req.params.id_member],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else { 
          res.status(200).json(results);  
        }  
      } 
    );  
  });

 // chat :envoyer un message
 router.post('/api/new_mess', function (req, res, next) {  
  console.log(req.body)
  db.query( 
      'INSERT INTO messages (id_member, id_event, message) VALUES (?,?,?)',
      [req.body.id_member, req.body.id_event, req.body.message], 
    (error) => { 
      if (error) { 
        res.status(500).json({status: error});  
      } else { 
        res.status(200).json({status: 'ok'}); 
      } 
    }  
  );
});  

  return router;

}

module.exports = createRouter;