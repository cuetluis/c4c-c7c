from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from . import db
from .models import Horse, Document, Treatment, TreatmentAction, AuditLog, DailyObservation
from sqlalchemy.orm import selectinload

views = Blueprint('views', __name__)
blacklisted = ["id", "created_at", "updated_at"]

#TODO: ENSURE LOGIN IS REQUIRED WHERE NECESSARY
#TODO: CHECK PERMISSIONS WHERE NECESSARY

# ==========================================
# HORSE ROUTES
# ==========================================

@views.route('/get-horse/<id>', methods=['GET'])
def get_horse(id):
    horse = db.session.get(Horse, id)
    if not horse: return jsonify({"error": f"no horse by id {id}"}), 404
    return jsonify(horse.to_dict())

@views.route('/get-farm', methods=['GET'])
def get_horses():
    stmt = db.select(Horse)
    result = db.session.execute(stmt).scalars().all()
    return jsonify([horse.to_dict() for horse in result])

@views.route('/add-horse', methods=['POST'])
@login_required
def add_horse():
    data = request.get_json()
    if not data: return jsonify({"error": "Missing JSON body"}), 400
    
    new_horse = Horse()
    for key, val in data.items():
        if hasattr(new_horse, key) and key not in blacklisted:
            setattr(new_horse, key, val)

    db.session.add(new_horse)
    db.session.flush()

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="horses",
        after_value=f"Created Horse ID: {new_horse.id} Name: {new_horse.name}"
    ))

    db.session.commit()
    return jsonify({"success": f"horse id is {new_horse.id}"})

@views.route('/mutate-horse/<id>', methods=['POST'])
@login_required
def mutate_horse(id):
    data = request.get_json()
    if not data: return jsonify({"error": "Missing JSON body"}), 400

    horse = db.session.get(Horse, id)
    if not horse: return jsonify({"error": "Not found"}), 404
    
    for key, val in data.items():
        if hasattr(horse, key) and key not in blacklisted:
            old_val = getattr(horse, key)
            if str(old_val) != str(val):
                db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="horses",
                    field_changed=key,
                    before_value=str(old_val),
                    after_value=str(val)
                ))
                setattr(horse, key, val)

    db.session.commit()
    return jsonify({"success": f"horse {id} modified"})

@views.route('/glue-factory/<id>', methods=['POST', 'DELETE'])
@login_required
def del_horse(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    horse = db.session.get(Horse, id)
    if not horse: return jsonify({"error": "Not found"}), 404

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="horses",
        before_value=f"ID: {id}, Name: {horse.name}",
        after_value="DELETED"
    ))

    db.session.delete(horse)
    db.session.commit()
    return jsonify({"success": f"horse {id} deleted"})

# ==========================================
# OBSERVATION ROUTES
# ==========================================

@views.route('/get-observations', methods=['GET'])
def get_observations():
    stmt = db.select(DailyObservation)
    results = db.session.execute(stmt).scalars().all()
    return jsonify([o.to_dict() for o in results])

@views.route('/get-observation/<id>', methods=['GET'])
def get_observation(id):
    observation = db.session.get(DailyObservation, id)
    if not observation: 
        return jsonify({"error": f"Observation {id} not found"}), 404
    return jsonify(observation.to_dict())

@views.route('/add-observation', methods=['POST'])
@login_required
def add_observation():
    data = request.get_json()

    obs = DailyObservation(
        user_id=current_user.id,
        notes=data.get("notes"),
        to_do=data.get("to_do"),
        done=data.get("done"),
        notify=data.get("notify"),
    )
    db.session.add(obs)
    db.session.flush()

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="observations",
        after_value=f"Created Observation ID: {obs.id}"
    ))
    
    db.session.commit()
    return jsonify({"success": "observation added"}), 201

@views.route('/mutate-observation/<id>', methods=['POST'])
@login_required
def mutate_observation(id):
    data = request.get_json()
    
    obs = db.session.get(DailyObservation, id)
    if not obs: return jsonify({"error": "Not found"}), 404
    
    for key, val in data.items():
        if hasattr(obs, key) and key not in blacklisted:
            old_val = getattr(obs, key)
            if str(old_val) != str(val):
                db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="observations",
                    field_changed=key,
                    before_value=str(old_val),
                    after_value=str(val)
                ))
                setattr(obs, key, val)

    db.session.commit()
    return jsonify({"success": f"observation {id} modified"})

@views.route('/delete-observation/<id>', methods=['POST', 'DELETE'])
@login_required
def del_observation(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    obs = db.session.get(DailyObservation, id)
    
    if not obs: return jsonify({"error": "Not found"}), 404

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="observations",
        before_value=f"ID: {id}, Note: {obs.notes[:20]}...",
        after_value="DELETED"
    ))

    db.session.delete(obs)
    db.session.commit()
    return jsonify({"success": f"observation {id} removed"})

# ==========================================
# DOCUMENT ROUTES
# ==========================================

@views.route('/get-documents/<horse_id>', methods=['GET'])
def get_documents(horse_id):
    stmt = db.select(Document).filter_by(horse_id=horse_id)
    results = db.session.execute(stmt).scalars().all()
    return jsonify([d.to_dict() for d in results])

@views.route('/add-document/<horse_id>', methods=['POST'])
@login_required
def add_document(horse_id):
    data = request.get_json()
    doc = Document(horse_id=horse_id)
    
    for key, val in data.items():
        if hasattr(doc, key) and key not in blacklisted:
            setattr(doc, key, val)

    db.session.add(doc)
    db.session.flush()
    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="horse_documents",
        after_value=f"Created Document ID: {doc.id}"
    ))
    
    db.session.commit()
    return jsonify({"success": "document added", "id": doc.id})

@views.route('/mutate-document/<id>', methods=['POST'])
@login_required
def mutate_document(id):
    data = request.get_json()
    doc = db.session.get(Document, id)
    if not doc: return jsonify({"error": "Not found"}), 404

    for key, val in data.items():
        if hasattr(doc, key) and key not in blacklisted:
            old_val = getattr(doc, key)
            if str(old_val) != str(val):
                db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="horse_documents",
                    field_changed=key,
                    before_value=str(old_val),
                    after_value=str(val)
                ))
                setattr(doc, key, val)

    db.session.commit()
    return jsonify({"success": "document updated"})

@views.route('/delete-document/<id>', methods=['POST', 'DELETE'])
@login_required
def delete_document(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    doc = db.session.get(Document, id)
    if not doc: return jsonify({"error": "Not found"}), 404

    db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="horse_documents",
                    before_value=f"ID: {id}, Desc: {doc.description[:20]}...",
                    after_value="DELETED"
                ))
    db.session.delete(doc)
    db.session.commit()
    return jsonify({"success": "document deleted"})

# ==========================================
# TREATMENT ROUTES (Definitions)
# ==========================================

@views.route('/get-treatments/<horse_id>', methods=['GET'])
def get_treatments(horse_id):
    stmt = db.select(Treatment).filter_by(horse_id=horse_id)
    results = db.session.execute(stmt).scalars().all()
    return jsonify([t.to_dict() for t in results])

@views.route('/add-treatment/<horse_id>', methods=['POST'])
@login_required
def add_treatment(horse_id):
    data = request.get_json()
    new_treatment = Treatment(horse_id=horse_id)
    
    for key, val in data.items():
        if hasattr(new_treatment, key) and key not in blacklisted:
            setattr(new_treatment, key, val)

    db.session.add(new_treatment)
    db.session.flush()

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="treatment_types",
        after_value=f"Added Treatment: {new_treatment.treatment_name} to Horse: {horse_id}"
    ))
    
    db.session.commit()
    return jsonify({"success": "treatment added", "id": new_treatment.id})

@views.route('/mutate-treatment/<id>', methods=['POST'])
@login_required
def mutate_treatment(id):
    data = request.get_json()
    if not data: return jsonify({"error": "Missing JSON body"}), 400

    treatment = db.session.get(Treatment, id)
    if not treatment: return jsonify({"error": "Not found"}), 404
    
    for key, val in data.items():
        if hasattr(treatment, key) and key not in blacklisted:
            old_val = getattr(treatment, key)
            if str(old_val) != str(val):
                db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="treatment_types",
                    field_changed=key,
                    before_value=str(old_val),
                    after_value=str(val)
                ))
                setattr(treatment, key, val)

    db.session.commit()
    return jsonify({"success": f"treatment {id} modified"})

@views.route('/delete-treatment/<id>', methods=['POST', 'DELETE'])
@login_required
def delete_treatment(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    treatment = db.session.get(Treatment, id)
    if not treatment: return jsonify({"error": "Not found"}), 404
    
    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="treatment_types",
        before_value=f"ID: {id}, Name: {treatment.treatment_name}",
        after_value="DELETED"
    ))

    db.session.delete(treatment)
    db.session.commit()
    return jsonify({"success": f"treatment {id} deleted"})

# ==========================================
# TREATMENT ACTION ROUTES
# ==========================================

@views.route('/get-actions/<horse_id>', methods=['GET'])
def get_actions(horse_id):
    stmt = db.select(TreatmentAction).filter_by(horse_id=horse_id)
    results = db.session.execute(stmt).scalars().all()
    return jsonify([a.to_dict() for a in results])

@views.route('/add-action/<horse_id>', methods=['POST'])
@login_required
def add_action(horse_id):
    data = request.get_json()
    new_action = TreatmentAction(horse_id=horse_id)
    
    for key, val in data.items():
        if hasattr(new_action, key) and key not in blacklisted:
            setattr(new_action, key, val)

    db.session.add(new_action)
    db.session.flush()

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="treatment_actions",
        after_value=f"Logged {new_action.treatment_type} for horse {horse_id}"
    ))
    db.session.commit()
    return jsonify({"success": "Action logged"})

@views.route('/mutate-action/<id>', methods=['POST'])
@login_required
def mutate_action(id):
    data = request.get_json()
    action = db.session.get(TreatmentAction, id)
    if not action: return jsonify({"error": "Not found"}), 404
    
    for key, val in data.items():
        if hasattr(action, key) and key not in blacklisted:
            old_val = getattr(action, key)
            if str(old_val) != str(val):
                db.session.add(AuditLog(
                    user_id = current_user.id,
                    table_changed="treatment_actions",
                    field_changed=key,
                    before_value=str(old_val),
                    after_value=str(val)
                ))
                setattr(action, key, val)

    db.session.commit()
    return jsonify({"success": f"action {id} modified"})

@views.route('/delete-action/<id>', methods=['POST', 'DELETE'])
@login_required
def delete_action(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    action = db.session.get(TreatmentAction, id)
    if not action: return jsonify({"error": "Not found"}), 404

    db.session.add(AuditLog(
        user_id = current_user.id,
        table_changed="treatment_actions",
        before_value=f"ID: {id}, Type: {action.treatment_type}",
        after_value="DELETED"
    ))
    db.session.delete(action)
    db.session.commit()
    return jsonify({"success": "Log entry removed"})

# ==========================================
# AUDIT LOG ROUTES
# ==========================================

@views.route('/get-audits', methods=['GET'])
def get_audits():
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    stmt = db.select(AuditLog).order_by(AuditLog.updated_at.desc())
    logs = db.session.execute(stmt).scalars().all()
    return jsonify([log.to_dict() for log in logs])

@views.route('/get-audit/<id>', methods=['GET'])
def get_audit(id):
    if current_user.admin == False:
        return jsonify({"error": "Unauthorized"}), 403
    
    log = db.session.get(AuditLog, id)
    if not log: 
        return jsonify({"error": f"Audit log {id} not found"}), 404
    return jsonify(log.to_dict())