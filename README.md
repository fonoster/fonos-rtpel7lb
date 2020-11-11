# Fonos RTPEL7LB

> A layer 7 load balancer to serve ng control protocol requests to rtpengine servers

![publish to docker](https://github.com/fonoster/fonos-rtpel7lb/workflows/publish%20to%20docker%20hub/badge.svg)

This load balancer aims to assist in scaling the media traffic in a VoIP network deployment. It uses the NG Control Protocol(NGCP) to allow for a "drop-in" replacement of RTPEngine.

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
    -p 2223:2223 \
    -p 8080:8080 \
    fonoster/fonos-rtpel7lb
```

## Specs

- [ ] Receive request using the [NG Control Protocol](https://github.com/sipwise/rtpengine#the-ng-control-protocol) and forward to RTPEngine instances
- [ ] Load balance RTP traffic using a round-robin algorithm 
- [ ] Implement a Restful API for internal service managment

The Restful API must implement the following methods:

API endpoint: `/engines`

<details><summary>Add</summary>

Adds a new RTPEngine.

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

<details><summary>Delete</summary>
    
Removes an RTPEngine by ID.

**Method**

`DELETE`

**Parameters**

| Parameter Name | Type   | Value | Description
| ---  | :--------- |  :--------- |  :--------- |
| id |  path | string | Engine reference |

**Request body**

Do not supply a request body with this method.

**Response**

If successful this method removes an Agent resource.

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

This method returns a list of available RTPEngines.

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

- `NG_CONTROL_PORT` - To receive control requests from RTPEngine clients such as Routr, OpenSIPS, Kamailio, etc.
- `ADMIN_PORT` - Port for internal service operations

## Exposed ports

- `2223` - Default NG Control Protocol Port
- `8080` - Default Admin Port

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fonoster/fonos/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- [Hector Ventura](https://github.com/hectorvent)
- [Pedro Sanders](https://github.com/psanders)

See also the list of contributors who [participated](https://github.com/fonoster/rtpel7lb/contributors) in this project.

## License

Copyright (C) 2020 by Fonoster Inc. MIT License (see [LICENSE](https://github.com/fonoster/fonos/blob/master/LICENSE) for details).
