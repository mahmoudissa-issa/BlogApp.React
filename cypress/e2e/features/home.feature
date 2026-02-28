Feature: Home Page

  Background:
    Given I visit the home page

  Scenario: Hero section is visible
    Then I should see the hero heading "FullStack Blog App"
    And I should see the subtitle "Click a tag to explore posts by topic"

  Scenario: Search input is rendered
    Then the search input should be visible
    And the search input placeholder should be "Search posts by title or author..."

  Scenario: Typing in the search input filters posts
    When I type "test" in the search input
    Then the search input should have the value "test"

  Scenario: All tag pill is active by default
    Then the first tag pill should contain "All"
    And the first tag pill should be active

  Scenario: Clicking a tag makes it active
    When I click the second tag pill
    Then the second tag pill should be active
    And the first tag pill should not be active
    When I click the first tag pill
    Then the first tag pill should be active
