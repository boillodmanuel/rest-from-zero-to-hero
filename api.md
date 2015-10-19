evolution superhero: http://orig00.deviantart.net/6214/f/2011/027/5/e/evolution_of_super_hero_by_artieyoon-d3851ye.jpg

# references
guide octo: http://blog.octo.com/designer-une-api-rest/
api hypermedia: http://www.slideshare.net/delirii/api-hypermedia-devoxx-fr

#0 Zero
On a demandé a la société de service BonDev de realiser l'api REST du devfest
voici le resultat:

Tout est GET
Verbes dans l'URI (a.k.a. HTTP as a tunnel)

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

On peut faire une parenthèse ici pour parler de ceux qui mettent tout en POST: "plus securisé, you know..."

=> Zero

#1

Identifier les ressources
Appliquer des opérations

ici slide sur les verbes
important de les utiliser a bon escient, de ne pas "tromper" l'utilisateur.

GET /speakers
POST / speakers => 200

GET /speakers/{id}
PUT /speakers/{id}
DELETE /speakers/{id}

#2 suite
regardons ce que ca donne sur les talks

POST /talks/{id}/noter/5

pb: 2 verbes
solution: sous-resources

POST /talks/{id}/notes -d {value: 5}


#3 code

pb: suivre la spec HTTP - voir exemple sur POST
quel code mettre?
avant de voir ca, un peu de theorie
1xx Hold on
2xx Here you go
3xx Go away
4xx You fucked up
5xx I fucked up

- 2xx:
 - 200 ok
 - 201: created
 - 202: accepted (async)
 - 204: no content
 - 206: partial content


- bad input
 - 400: bad request
 - 412: preconditions failure
 - 422: semantic errors
- bad page / rights
 - 401: authentication failed
 - 403: bad authorisation
 - 404: not found
- bad request
 - 405: bad method
 - 406: bad content type
 - 415: bad accept / media type
- concurrency
 - 409: conflict
 - 423: lock
- rate limit
 - 429: too many request
- server error
 - 500: internal error
 - 503: service unavailable

Reprenons les methodes

La methode poste
spec HTTP de POST = 201 + header location ()

> If a resource has been created on the origin server, the response SHOULD be 201 (Created) and contain an entity which describes the status of the request and refers to the new resource, and a Location header (see section 14.30).

[w3c|http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5]

POST /speakers => 201 + Location: /speakers/120 + retourne nouvelle entity `{"id": 120, "name": "toto"}`

Autres methodes
 PUT /speakers => 200
 POST /speakers => 201
 GET /speakers/{id} => 200
 PUT /speakers/{id} => 200
 DELETE /speakers/{id} => 204

Documenter aussi les codes d'erreur (Deplacer dans une section documentation?)
PUT /speakers/{id} => 200, 404, 400

gestion des erreurs:
retourner statut HTTP + body => sinon CURL ne le montre pas!

#4 pagination

2 types
- liste de taille fixe: pagination par page
- stream: pagination par elements suivant

ajouter les infos sur les pages (courante, debut, fin, prochaine, ...)
2 methodes:
- dans les headers

```
Link: <https://api.github.com/user/repos?page=3&per_page=100>; rel="next",
<https://api.github.com/user/repos?page=50&per_page=100>; rel="last"
```

on aime pas car CURL ne le montre pas par defaut

- dans le contenu
```json
{
  "page": 1,
  "size": 20,
  "first": 1,
  "last": 5,
  "total": 97,
  "items": [
    {"id": 100},
    {"id": 118},
    ...
  ]
}
```
+ retourner 206: partial content

aussi filtre / tri / non detaillé

#5 content negociation 1
Accept: application/json; application/xml
si on doit en choisir qu'un: json (compatibilité javascript)


#6 CORS (2min)

on developpe l'appli web
et mince, ca marche pas!!
http://blog.toright.com/wp-content/uploads/2013/03/cors_chrome_2-542x480.png

CORS DOIT etre supporté par votre serveur web (express, hapi, restlet framework, ...) / chiant a coder / plein de regles et spec c'est une spec quoi, pas super clair

#7 secu / rights / permissions (2min)

utiliser une solution d'authenticiation:
- simple (sans date d'expiration)
  - basic auth
  - api token
- avec expiration
  - oauth2 (pas tous)
  - json web token

souvent header ou query param

#8 versionning

dans path
v1/speakers (GET)
```json
{"id": 1}
```

pb de securité / ajouter de l'anthropie dans les valeurs pour eviter le brut force

v2/speakers (GET)
```json
{"id": "u-u-i-d"}
```
#9 hypermedia hateoas / content negociation 2 / versionning

call to `/`

```json
{
  "_links":[
    {"rel":"speakers", "href": "http://example.com/speakers", "method": "GET"},
    {"rel":"talks", "href": "http://example.com/talks", "method": "GET"},
  ]
}
```

call to rel `speakers`: `http://example.com/speakers`

```json
{
  "items": [
    {
      "id": 1,
      "nom": "toto",
      "bio": "",
      "_links":[
        {"rel":"self", "href": "http://example.com/speakers/1", "method": "GET"},
        {"rel":"delete", "href": "http://example.com/spearkers/1", "method": "DELETE"},
      ]
    },
    ...
  ]
}
```
=> gestion des droits par le backend / le front end sait l'action "delete" est possible ou non pour la donnée et l'utilisateur
{"rel":"delete", title:"Delete speaker", "href": "http://example.com/spearkers/1", "method": "DELETE"},


content type: (voir video https://apigility.org/ a 1 min 50)
GET http://example.com/speakers/1" => return application/vnd.speaker.v1+json
si erreur => return application/vdn.error.v1+json


#10 You're a Hero

share your swagger or raml
