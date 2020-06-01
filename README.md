# guilherme-20200601

## Installation

```sh
$ npm install --prefix file-upload-server/
$ npm install --prefix file-upload-ui/
```
## Usage

```sh
$ npm run start:dev --prefix file-upload-server/
$ npm start --prefix file-upload-ui/
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Security

### Addressed

#### File Upload Protection
- Whitelist Extensions Validation
- Whitelist Content-Type Validation
- File Name Sanitization
  - Create random string as file name
  - Whitelist regex validation on original file name
  - Max length on original file name
- [Partially] Store files on a different host

#### Endpoints
- Parameters Sanitization
- Stored Data Validation

### Not Addressed

#### File Upload Protection
- File Content Validation
  - image rewriting
  - convert to fixed format
- Use containers and volumes to sandbox storage location
- Filesystem Permissions

## Improvements

### AP
- Improve UX
- Improve client side error handling
- Add client side validations
- Allow custom friendly name for the image
- Add image visualization
- Add internationalization
- Containerize AP

### API
- Use better persistence technology
- Add unit tests
- Add configurations (e.g.: file location)
- Containerize AP

## Libraries

### API
- overnightjs: Some decorators to make endpoint classes more similar to other frameworks
- lowdb: simple persistence to keep file information for fast queries
- multer: handling of file upload
- uuid: random file name generation

## API
```
### GET /api/images
Retrieve all persisted documents

Success Reponse:
  Code: 200
  Content: [ {
    friendlyName: string,
    size: number
  } ]

### GET /api/images/search?pattern
Search in persistend documents where <friendlyName> contains <pattern>

Success Reponse:
  Code: 200
  Content: [ {
    friendlyName: string,
    size: number
  } ]

Error Reponse:
  Code: 400 BAD REQUEST //when pattern is not valid
  Code: 413 PAYLOAD TOO LARGE //when file being uploaded is greater than 10MB
  Code: 415 UNSUPPORTED MEDIA TYPE //when file type not valid

### POST /api/images/:friendlyName
Persist document using <friendlyName> as the file identifier
Accept single file

Success Reponse:
  Code: 201

Error Reponse:
  Code: 400 BAD REQUEST //when friendlyName is not valid

### DELETE /api/images/:friendlyName
Remove document using <friendlyName> as the file identifier

Success Reponse:
  Code: 204

Error Reponse:
  Code: 400 BAD REQUEST //when friendlyName is not valid
```
---
## Other notes
