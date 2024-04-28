
function prevPage() {
    var currentPage = parseInt(document.getElementById("currentPage").textContent);
    window.location.href = '/cves/list?page=' + (currentPage - 1) + '&resultsPerPage=' + document.getElementById("resultsPerPage").value;
  }

  function nextPage() {
    var currentPage = parseInt(document.getElementById("currentPage").textContent);
    window.location.href = '/cves/list?page=' + (currentPage + 1) + '&resultsPerPage=' + document.getElementById("resultsPerPage").value;
  }

  function changeResultsPerPage() {
    var perPage = document.getElementById("resultsPerPage").value;
    window.location.href = '/cves/list?page=1&resultsPerPage=' + perPage;
  }

  document.addEventListener("DOMContentLoaded", async function() {
    const tableBody = document.getElementById("cveTableBody");

    // Fetch CVE data from Flask backend
    const response = await fetch("/");  // Fetch data from the root route
    const data = await response.json();
    const queryParams = new URLSearchParams(window.location.search);
    const perPage = queryParams.get('resultsPerPage') || 10; // Default to 10 if not provided
    const cveData = data.vulnerabilities.slice(0, perPage); // Display only the first 'perPage' records

    // Function to format date in "DD MMM YYYY" format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Populate table with CVE data
    cveData.forEach(cve => {
      const row = document.createElement("tr");
      const publishedDate = formatDate(cve.cve.published); // Format published date
      const lastModifiedDate = formatDate(cve.cve.lastModified); // Format last modified date
      const sourceIdentifier = cve.cve.sourceIdentifier;
      row.innerHTML = `
        <td>${cve.cve.id}</td>
        <td>${sourceIdentifier}</td> <!-- Display the source identifier -->
        <td>${publishedDate}</td> <!-- Format published date -->
        <td>${lastModifiedDate}</td> <!-- Format last modified date -->
        <td>${cve.cve.vulnStatus}</td>
      `;
      tableBody.appendChild(row);
    });

    // Update pagination buttons based on current page
    const currentPage = parseInt(document.getElementById("currentPage").textContent);
    const totalPages = Math.ceil(data.vulnerabilities.length / perPage);
    document.getElementById("totalPages").textContent = totalPages;
    if (currentPage === 1) {
      document.getElementById("prevPageBtn").disabled = true;
    }
    if (currentPage === totalPages) {
      document.getElementById("nextPageBtn").disabled = true;
    }

    // Update selected option in the dropdown menu
    document.getElementById("resultsPerPage").value = perPage;
  });