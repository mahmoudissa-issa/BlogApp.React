Feature: Login Page

  Background:
    Given I visit the login page

  Scenario: Login page loads with heading
    Then I should see the heading "Sign in to your account"

  Scenario: Email and password inputs are rendered
    Then the email input should be visible
    And the password input should be visible

  Scenario: Sign In button is rendered
    Then the Sign In button should be visible

  Scenario: Validation errors appear on empty form submission
    When I click the Sign In button
    Then I should see at least one validation error

  Scenario: Validation error on invalid input
    When I type "not-an-email" in the email input
    And I type "short" in the password input
    And I click the Sign In button
    Then I should see at least one validation error

  Scenario: Password visibility can be toggled
    Then the password input type should be "password"
    When I click the password toggle button
    Then the password input type should be "text"
    When I click the password toggle button
    Then the password input type should be "password"

  Scenario: Register link is present
    Then I should see a link to the register page

  Scenario: Forgot password link is present
    Then I should see a link to the forgot password page

  Scenario: Clicking Register here navigates to register page
    When I click the Register here link
    Then the URL should contain "/Register"
