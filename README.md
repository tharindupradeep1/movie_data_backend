# Movie Data Backend
 
This API provides functionality to manage and retrieve movie data. This document explains the available endpoints to get the list of movies, fetch a movie by ID, and update movie data.
 
## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
 - [List movies](#list-movies)
 - [Update movie](#update-movie)
 - [Get movie By ID](#get-movie-by-id)
 
## Introduction
 
Movie Data Backend API provides a simple interface to retrieve and manage movie data. The endpoints supports listing movies with the ability to filter the movies by the genre or the title and sort the movies by title or the release date and updating a given movie.
 
## Features
 
- List movies
- Update the details of the existing movies
- Filter the existing movies by genre or the title when listing
- Sort the existing movies by title or the release date when listing
- Authorization via JWT
- docker for easy setup and runing the project
 
## Getting Started
 
### Prerequisites
 
- Node.js v18+
 
### Installation
 
1. Clone the repository:
  ```bash
  git clone
 ```
2. Cofigurations
Setup the configurations in .env file
```env
DATABASE_HOST=your_db_host
DATABASE_PORT=your_db_port
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```
3. Run the project
```bash
cd movie_data_backend
docker-compose up
```
## Authentication
Movie Data Backend uses token-based authentication with JWT. However, there are no dedicated authentication endpoints (e.g., login, signup) in this API. Instead, users need to obtain a JWT token from a third-party authentication service with the defined JWT_SECRET in the .env file in the app and include it in the Authorization header of their requests.

```http
Authorization: Bearer your_generated_token
```
## Endpoints
### List movies
- URL :  `/movies/list`
- Method: `POST`
- Headers: `Authorization: Bearer {JWT}`
- Description: Enables fetching a list of movies.
- Body parameters:
    - `page` (Integer, required): Page number of which data should be retrieved
    - `pageSize` (Integer, required): Number of records included in a page
    - `filterBy` (Integer, optional): filter criteria
        - 0 :  Genre
        - 1 :  Title
    - `filterByValue` (String, optional): search string realted to filter criteria
    - `sortBy` (Integer, optional): sort criteria
        - 0 :  Release Date
        - 1 :  Title
    - `sortOrder` (String, optional): Order for which the data should be sorted (Ascending or Descending)
        - "ASC"
        - "DESC"

Sample Request
```http
{
    "page": 1,
    "pageSize": 1,
    "filterBy": 0,
    "filterByValue": "",
    "sortBy": 0,
    "sortOrder": "DESC"
}
 ```
Sample Response
```json
{
    "data": [
        {
            "title": "Stasis",
            "overview": "After a night out of partying and left behind by her friends, Ava wakes up and sneaks back home only to find that she's already safe in bed. But that's not Ava - it's someone who looks just like her. A time-traveling fugitive has stolen Ava's body, her identity, and her life. What's more -- she's not alone. There are others, hiding in the past, secretly living among us, plotting to alter the future. Without her body, Ava is a virtual ghost, silent and invisible to the world. And, so far as she knows, she's the only one who can stop them and put the timeline back on course.",
            "releaseDate": "2017-06-02",
            "runtime": 84,
            "voteAverage": 4,
            "genres": [
                {
                    "id": 12,
                    "name": "Adventure"
                },
                {
                    "id": 878,
                    "name": "Science Fiction"
                }
            ],
            "id": "451336db-f261-4ab5-bae7-7b3e843b0676"
        }
    ],
    "meta": {
        "currentPage": 1,
        "pageSize": 1,
        "totalPages": 500
    }
}
 ```
### Update movie
- URL :  `/movies`
- Method: `PATCH`
- Headers: `Authorization: Bearer {JWT}`
- Description: Enables updating the details of a given movie.
- Path parameters:
    -`id` (String, required): Movie ID
- Body parameters:
    - `title` (String, optional): Title of the movie
    - `overview` (String, optional): Overview of the movie
    - `runtime` (Integer, optional): Runtime of the movie
    - `voteAverage` (Integer, optional): Vote average of the movie
    - `genres` (Integer array, optional): List of genre IDs
    - `releaseDate` (String array, optional): Release date of the movie

Sample Request
```http
{
    "title": "Test",
    "overview": "Test overview",
    "runtime": 2,
    "voteAverage": 10,
    "genres":[35,27],
    "releaseDate": ""
}
 ```
Sample Response
```json
{
    "title": "Test",
    "overview": "Test overview",
    "releaseDate": "",
    "runtime": 2,
    "voteAverage": 10,
    "genres": [
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 27,
            "name": "Horror"
        }
    ],
    "id": "da56fe0d-8b75-4e8b-8665-c64d4a7822c7"
}
```
### Get movie By ID
- URL :  `/movies`
- Method: `GET`
- Headers: `Authorization: Bearer {JWT}`
- Description: Enables fetching a specific movie.
- Path parameters:
    -`id` (String, required): Movie ID
 
Sample Response
```json
{
    "title": "The Dentures",
    "overview": "Mother in law gets a new set of dentures. Despite being initially happy, the family soon discovers the teeth have a life of their own and jump from their owner's mouth and bite everyone who comes near--from ladies to gentlemen to policemen.",
    "releaseDate": "1909-11-16",
    "runtime": 3,
    "voteAverage": 5,
    "genres": [
        {
            "id": 35,
            "name": "Comedy"
        }
    ],
    "id": "041982b9-cef5-40a2-9b68-586e4f8169e1"
}
```
