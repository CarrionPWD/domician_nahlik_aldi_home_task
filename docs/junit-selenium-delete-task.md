# Bonus: JUnit + Selenium — Delete Task

## Approach

I would:

Open the web application
Create or locate an existing task
Click the Delete button
Confirm deletion
Verify the task is no longer visible

## Sample test

@Test
void deleteTask_removesItemFromList() {
    driver.get("https://www.aldi.us/tasks/");

    driver.findElement(By.id("delete-btn-1")).click();

    boolean exists =
        driver.findElements(By.id("task-1")).size() > 0;

    assertFalse(exists);
}
JUnit handles assertions and test structure, Selenium handles browser interaction.

## Please forgive me for this, I haven't used Selenium in a while
