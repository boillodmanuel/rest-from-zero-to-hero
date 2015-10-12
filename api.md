#0

Tout est GET
```
listerSpeakers => 200
infoSpeaker?id=34 => 200
modifierSpeaker?id=34 => 200 => sans reponse
ajouterSpeaker => 200
supprimerSpeaker?id=34 => 200

listerTalks
infoTalks
noterTalks
```

```json
{
  "id": 1,
  "nom": "toto",
  "bio": ""
}
```

#1

pb: non utilisation du cache
solution: notion de resource + methode
benefice: standard / affordance

GET /speakers
POST / speakers => 200

GET /speakers/{id}
PUT /speakers/{id}
DELETE /speakers/{id}

#2 nommage des resources
regardons ce que ca donne sur les talks

POST /talks/{id}/noter/5

pb: 2 verbes
solution: sous-resources

POST /talks/{id}/notes -d {value: 5}

#3 code

pb: suivre la spec HTTP - voir exemple sur POST

PUT /speakers => 200
POST /speakers => 201
GET /speakers/{id} => 200
PUT /speakers/{id} => 200
DELETE /speakers/{id} => 204

POST:
400:
401:
403:
422:
409: conflict
415:
