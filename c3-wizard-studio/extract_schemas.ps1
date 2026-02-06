
$content = Get-Content "d:\Projects\Neeraj Sir APP\C3-wizard-recreation\c3-wizard-studio\mssql_backup\c3wizardschema.sql" -Raw

$pattern1 = "(?s)CREATE TABLE \[dbo\]\.\[Master_Rate_Setting\].*?CONSTRAINT"
$pattern2 = "(?s)CREATE TABLE \[dbo\]\.\[NWD_Master_Rate_Settings\].*?CONSTRAINT"

$match1 = [regex]::Match($content, $pattern1)
$match2 = [regex]::Match($content, $pattern2)

$output = "--- Master_Rate_Setting ---`r`n"
if ($match1.Success) {
    $output += $match1.Value + "`r`n"
} else {
    $output += "Not found`r`n"
}

$output += "`r`n--- NWD_Master_Rate_Settings ---`r`n"
if ($match2.Success) {
    $output += $match2.Value + "`r`n"
} else {
    $output += "Not found`r`n"
}

$output | Set-Content "d:\Projects\Neeraj Sir APP\C3-wizard-recreation\c3-wizard-studio\temp_schema_comparison.txt" -Encoding utf8
