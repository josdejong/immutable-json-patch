# How to publish

1.  Make sure all works:
    ```
    npm run build-and-test
    ```
2.  In `CHANGELOG.md`:
    - Describe the changes 
    - Fill in date and
    - Fill in version number
3.  Update version number in `package.json`
4.  Run `npm install` to get the updated version also in `package-lock.json`
5.  Commit changes
    ```
    $ git add CHANGELOG.md package.json package-lock.json
    $ git commit -m "Publish v1.2.3"
    ```
6.  Merge `develop` into `main`:
    ```
    $ git checkout main
    $ git merge develop
    ```
7.  Push changes:
    ```
    git push
    ```
8.  Create version tag:
    ```
    $ git tag v1.2.3
    $ git push --tags
    ```
9.  Wait until the github build workflow finish and is green
10. Publish on npm:
    ```
    $ npm publish
    ```
11. Checkout `develop` again
    ```
    $ git checkout develop
    ```
