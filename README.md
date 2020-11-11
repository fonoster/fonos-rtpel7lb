# Fonos RTPEL7LB

> A layer 7 load balancer to serve ng control protocol requests to instances of rtpengine.

![publish to docker](https://github.com/fonoster/fonos-rtpel7lb/workflows/publish%20to%20docker%20hub/badge.svg)

This load balancer aims to assist in scaling the media traffic in a VoIP network deployment. It uses the NG Control Protocol(NGCP) to allow for a "drop-in" replacement of RTPEngine.

![Highlevel ARQ](https://raw.githubusercontent.com/fonoster/fonos-rtpel7lb/main/diagram.png "RTPEL7LB, high-level diagram")

For more documentation on how Fonos images are constructed and how to work with them, please see the [documentation](https://github.com/fonoster/fonos).

## Available Versions

You can see all images available to pull from Docker Hub via the [Tags](https://hub.docker.com/repository/registry-1.docker.io/fonoster/fonos-rtpel7lb/tags?page=1) page. Docker tag names that begin with a "change type" word such as task, bug, or feature are available for testing and may be removed at any time.

## Installation

You can clone this repository and manually build it.

```
cd fonoster/fonos-rtpel7lb\:%%VERSION%%
docker build -t fonoster/fonos-rtpel7lb:%%VERSION%% .
```

Otherwise you can pull this image from docker index.

```
docker pull fonoster/fonos-rtpel7lb:%%VERSION%%
```

## Usage Example

The following is a basic example of using this image.

```
docker run -it \
    -p 22222:22222 \
    -p 8080:8080 \
    fonoster/fonos-rtpel7lb
```

## Specs

This service must implement the following:

- [ ] Receive request using the [NG Control Protocol](https://github.com/sipwise/rtpengine#the-ng-control-protocol) and forward to instances of RTPEngine 
- [ ] Load balance RTP traffic using a round-robin algorithm 
- [ ] Implement a Restful API for internal service managment

The Restful API must implement the following methods:

API endpoint: `/engines`

<details><summary>Add</summary>

<br>Adds a new RTPEngine.</br>

**Method**

`POST`

**Parameters**

Do not supply any parameter to this method.

**Request body**

In the body you must include at a minimal a `hostAddress.` If no `id` is provided the service will generate one.

**Response**

If successful this method adds a new RTPEngine to its list.

**Sample Call**

```json
POST /engines
{
  "id": "rtpengine01",
  "hostAddress": "10.22.2.89"
}

HTTP/1.1 201 Created
{
  "status": "201",
  "message": "Added",
  "data": "rtpengine01"
}
```
</details>

<details><summary>Get</summary>

<br>This method returns an RTPEngine by ID.</br>

**Method**

`GET`

**Parameters**

| Parameter Name | Type   | Value | Description
| ---  | :--------- |  :--------- |  :--------- |
| id |  path | string | Engine identifier |

**Request body**

Do not supply a request body with this method.

**Response**

If successful this method returns a single RTPEngine.

**Sample Call**

```json
GET /engines/{id}
{

}

HTTP/1.1 200 OK
{
   "status":"200",
   "message":"Successful request",
   "data":{
     "id":"rtpengine01",
     "hostAddress":"10.22.2.88",
     "status":"Active",
     "updateTime":"1605052750"
   }
}
```
</details>

<details><summary>Update</summary>

<br>Updates an existing RTPEngine.</br>

**Method**

`PUT`

**Parameters**

This method does not receive any parameters.

**Request body**

An empty body will cause the server to refresh the `timeUpdate`. 

> You might also Ppass the `status`. The allowed parameters are `Active` and `Suspended.`

**Response**

If successful this method updates an existing RTPEngine.

**Sample Call**

```json
PUT /engines/{id}
{
}

HTTP/1.1 200 OK
{
  "status": "200",
  "message": "Successful request"
}
```
</details>

<details><summary>Delete</summary>
    
<br>Removes an RTPEngine by ID.</br>

**Method**

`DELETE`

**Parameters**

| Parameter Name | Type   | Value | Description
| ---  | :--------- |  :--------- |  :--------- |
| id |  path | string | Engine indentifier |

**Request body**

Do not supply a request body with this method.

**Response**

If successful this method removes the RTPEngine.

**Sample Call**

```json
DELETE /engines/rtpengine01
{

}

HTTP/1.1 200 OK
{
  "status": "200",
  "message": "Successful request"
}
```
</details>

<details><summary>List</summary>

<br>This method returns a list of available RTPEngines.</br>

**Method**

`GET`

**Parameters**

Do not supply any parameter to this method.

**Request body**

Do not supply a request body with this method.

**Response**

If successful this method returns a list with all available RTPEngines.

**Sample Call**

```json
GET /engines
{

}

HTTP/1.1 200 OK
{
   "status":"200",
   "message":"Successful request",
   "data":[
      {
         "id":"rtpengine01",
         "hostAddress":"10.22.2.88",
         "status":"Active",
         "updateTime":"1605052750"
      },
      {
         "id":"rtpengine02",
         "hostAddress":"10.22.2.89",
         "status":"Suspended",
         "updateTime":"1605056750"
      }
   ]
}
```
</details>


## Environment Variables

Environment variables are used in the entry point script to render configuration templates. You can specify the values of these variables during `docker run`, `docker-compose up`, or in Kubernetes manifests in the `env` array.

- `NG_PORT` - To receive control requests from RTPEngine clients such as Routr, OpenSIPS, Kamailio, etc. Defaults to `22222`
- `ADMIN_PORT` - Port for operations internal to this service. Defautls to `8080`
- `TIMEOUT` - Time in seconds to receive hearbeat(or be removed). Defaults to `30`

## Exposed ports

- `22222` - Default NG Control Protocol Port
- `8080` - Default Admin Port

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fonoster/fonos/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- [Hector Ventura](https://github.com/hectorvent)
- [Pedro Sanders](https://github.com/psanders)

See also the list of contributors who [participated](https://github.com/fonoster/rtpel7lb/contributors) in this project.

## License

Copyright (C) 2020 by Fonoster Inc. MIT License (see [LICENSE](https://github.com/fonoster/fonos/blob/master/LICENSE) for details).
