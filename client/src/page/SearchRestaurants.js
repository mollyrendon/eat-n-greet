import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { searchRapidRestaurants } from "../utils/API";
import {
  saveRestaurantIds,
  getSavedRestaurantIds,
} from "../utils/localStorage";
import { SAVE_RESTAURANT } from "../utils/mutations";
import { useMutation } from "@apollo/react-hooks";

var locationNum = 0;
var locationName = "";
var userZipCode = [];

//else pop up modal that states the zip cannot be validated to enter a valid zip code
// save user zip to local storage
var addZip = (event) => {
	event.preventDefault();
	var addUserZip = document.getElementById("zip").value;

	// if statement
	if (isNaN(addUserZip) || addUserZip < 10000 || addUserZip > 99999) {
		// enter error modal
		var showModal = function() {
			var modal = document.getElementById("modal");
			modal.classList.add("is-active");
		}
		showModal();
		
		var confirmError = function() {
			var error = document.getElementById("modal")
			error.classList.remove("is-active");
			location.reload();
		}
		document.getElementById("errorBtn"), addEventListener("submit", confirmError);
		
	} else {
	userZipCode.push(addUserZip);
	console.log(userZipCode);

	//save to local storage
	localStorage.setItem("zipCode", JSON.stringify(addUserZip))

	//load other webpage
	loadResults();
}
}


const SearchRestaurants = () => {
    const [searchedRestaurants, setSearchedRestaurants] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const [savedRestaurantIds, setSavedRestaurantIds] = useState(getSavedRestaurantIds());

    useEffect(() => {
        return () => {
            saveRestaurantIds(savedRestaurantIds);
        };
    });

    const [saveRestaurant, { error }] = useMutation(SAVE_RESTAURANT);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }

  const [savedRestaurantIds, setSavedRestaurantIds] = useState(
    getSavedRestaurantIds()
  );

  useEffect(() => {
    return () => {
      saveRestaurnatIds(savedRestaurantIds);
    };
  });

  const [saveRestaurant, { error }] = useMutation(SAVE_RESTAURANT);

            const restaurantData = items.map((restaurant) => ({
                restaurantId: restaurant.id,

                // title: book.volumeInfo.title,
                // description: book.volumeInfo.description,
                // image: book.volumeInfo.imageLinks?.thumbnail || "",

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchRapidRestaurants(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const restaurantData = items.map((restaurant) => ({
        restaurantId: restuarnt.id,
        // title: book.volumeInfo.title,
        // description: book.volumeInfo.description,
        // image: book.volumeInfo.imageLinks?.thumbnail || "",

        //Restaurant Data to Add
        // language
        // limit
        // location_id
        // currency
      }));

      setSearchedRestaurants(restaurantData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRestaurant = async (restaurantId) => {
    const restaurantToSave = searchedRestaurants.find(
      (restaurant) => restaurant.restaurantId === restaurantId
    );

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveRestaurant({
        variables: {
          input: restaurantToSave,
        },
      });

      if (!response) {
        throw new Error("something went wrong!");
      }

      setSavedRestaurantIds([
        ...savedRestaurantIds,
        restaurantToSave.restaurantId,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Restaurants!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a restaurant"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedRestaurants.length
            ? `Viewing ${searchedRestaurants.length} results:`
            : "Search for a restaurant to begin"}
        </h2>
        <CardColumns>
          {searchedRestaurants.map((restaurant) => {
            return (
              <Card key={restaurant.restaurantId} border="dark">
                {/* {restaurant.image ? (
                                    <Card.Img
                                        src={restaurant.image}
                                        alt={`The cover for ${restaurant.title}`}
                                        variant="top"
                                    />
                                ) : null} */}
                <Card.Body>
                  {/* <Card.Title>{book.title}</Card.Title> */}
                  {/* <p className="small">Authors: {book.authors}</p> */}
                  {/* <Card.Text>{book.description}</Card.Text> */}
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedRestaurantIds?.some(
                        (savedRestaurantId) =>
                          savedRestaurantId === restaurant.restaurantId
                      )}
                      className="btn-block btn-info"
                      onClick={() =>
                        handleSaveRestaurant(restaurant.restaurantId)
                      }
                    >
                      {savedRestaurantIds?.some(
                        (savedRestaurantId) =>
                          savedRestaurantId === restaurant.restaurantId
                      )
                        ? "This restaurant has already been saved!"
                        : "Save this restaurant!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchRestaurants;
