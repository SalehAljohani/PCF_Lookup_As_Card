import { IInputs, IOutputs } from "./generated/ManifestTypes";

interface IAttribute {
    name: string;
    displayName: string;
}

const FakeOOP = {
    entityName: "savedquery",
};

export class LookupAsCard implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _cardContainer: HTMLDivElement;
    private _container: HTMLDivElement;  // Removed _cardTitle
    private _recordData: any;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        this._cardContainer = document.createElement("div");
        this._cardContainer.id = "card";

        container.appendChild(this._cardContainer); // Only append card container
        let fetchXML;
    }

    private async retrieveAttribute(): Promise<{ records: any, columns: IAttribute[] }> {
        try {
            const view = this._context.parameters.ViewName.raw;
            if (!view) throw new Error("No view name provided");

            // Get view metadata
            const viewRecord = await this._context.webAPI.retrieveMultipleRecords(
                "savedquery",
                `?$filter=name eq '${view}' and statecode eq 0`,
                1
            );

            if (!viewRecord.entities.length) throw new Error("View not found");

            // Parse layout XML for columns
            const viewDefinition = viewRecord.entities[0];
            const layoutXml = new DOMParser().parseFromString(viewDefinition.layoutxml, "text/xml");
            const columns: IAttribute[] = Array.from(layoutXml.querySelectorAll("cell")).map(cell => ({
                name: cell.getAttribute("name") || "",
                displayName: cell.getAttribute("name") || "" // You might want to get actual display names from metadata
            }));

            // Get target entity and record
            const fetchXml = new DOMParser().parseFromString(viewDefinition.fetchxml, "text/xml");
            const targetEntity = fetchXml.querySelector("entity")?.getAttribute("name");
            if (!targetEntity) throw new Error("Target entity not found");

            // Get record data
            const query = `?$select=${columns.map(col => col.name).join(",")}`;
            const recordData = await this._context.webAPI.retrieveRecord(
                targetEntity,
                this._context.parameters.lookupField.raw![0].id,
                query
            );

            return {
                records: recordData,
                columns: columns
            };
        } catch (error) {
            console.error("Error:", error);
            return { records: null, columns: [] };
        }
    }

    private convertNewlinesToHtml(text: string): string {
        if (!text) return '';
        return text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }

    private isRTL(text: string): boolean {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text);
    }

    // Remove the HTML tag which block table from taking 100% width, it's a square that comes with every lookup field I think.
    private removeHtmlTag() {
        // Select the parent element using a stable attribute
        const parentElement = document.querySelector('[data-id="ntw_actionplanid-FieldSectionItemContainer"]');

        if (parentElement) {
            // Log the parent element
            console.log('Parent Element:', parentElement);
            const dynamicChild = parentElement.querySelector('[role="img"]'); // selector for child with role="img"

            if (dynamicChild) {
                console.log('Dynamic Child:', dynamicChild);
                dynamicChild.remove();
            } else {
                console.error('Dynamic child not found!');
            }
        } else {
            console.error('Parent element not found!');
        }

    }

    public async updateView(context: ComponentFramework.Context<IInputs>): Promise<void> {
        if (!context.parameters.lookupField?.raw?.[0]) {
            this._cardContainer.innerHTML = "No lookup value selected";
            return;
        }

        const lookupValue = context.parameters.lookupField.raw[0];
        const result = await this.retrieveAttribute();

        if (!result.records) {
            this._cardContainer.innerHTML = "Error loading data";
            return;
        }
        this.removeHtmlTag();
        // Create table content directly
        let content = "<table id='gridCard'>";

        // Add rows using column metadata
        for (const column of result.columns) {
            const value = result.records[column.name];
            if (value !== null && value !== undefined) {
                const direction = this.isRTL(value.toString()) ? 'rtl' : 'ltr';
                content += `<tr>
                    <th>${column.displayName}</th>
                    <td dir="${direction}">${this.convertNewlinesToHtml(value.toString())}</td>
                </tr>`;
            }
        }

        content += "</table>";
        this._cardContainer.innerHTML = content;
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup
    }
}